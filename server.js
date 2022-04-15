import { ApolloServer } from 'apollo-server-express';
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageGraphQLPlayground,
} from 'apollo-server-core';
import express from 'express';
import http from 'http';
import dataSourceClient from './model';
import pubsubClient from './pubsub';
import depthLimit from 'graphql-depth-limit';
import costAnalysis from 'graphql-cost-analysis';
import {
  SERVER_TIMEOUT,
  MAXIMUM_QUERY_DEPTH,
  MAXIMUM_SERVER_CONNECTIONS,
  MAXIMUM_GRAPHQL_REQUEST_COST,
} from './constants';
import { execute, subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';

export default async function startApolloServer(schema) {
  // Integrating with Express app
  const app = new express();
  const httpServer = http.createServer(app);

  // HTTP server configuration
  httpServer.timeout = SERVER_TIMEOUT;
  httpServer.maxConnections = MAXIMUM_SERVER_CONNECTIONS;

  // Subscription server initialization
  const subscriptionServer = SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
      onConnect(connectionParams, webSocket, context) {
        console.log('Subscription Server Connected');
        return { pubsub: pubsubClient };
      },
      onDisconnect(webSocket, context) {
        console.log('Subscription Server Disconnected');
      },
    },
    { server: httpServer },
  );

  // Apollo Server initialization
  const server = new ApolloServer({
    schema,
    introspection: true,
    validationRules: [
      depthLimit(MAXIMUM_QUERY_DEPTH),
      // costAnalysis({
      //   maximumCost: MAXIMUM_GRAPHQL_REQUEST_COST,
      // }),
    ],
    context: async ({ req }) => ({
      auth: 'handle authorization',
      db: dataSourceClient,
      pubsub: pubsubClient,
    }),
    plugins: [
      // Proper shutdown for the HTTP server.
      ApolloServerPluginDrainHttpServer({ httpServer }),
      // Proper shutdown for the WebSocket server.
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await subscriptionServer.close();
            },
          };
        },
      },
      ApolloServerPluginLandingPageGraphQLPlayground({
        settings: {
          'some.setting': true,
          'general.betaUpdates': false,
          'editor.theme': 'dark',
          'editor.cursorShape': 'line',
          'editor.reuseHeaders': true,
          'tracing.hideTracingResponse': true,
          'queryPlan.hideQueryPlanResponse': true,
          'editor.fontSize': 14,
          'editor.fontFamily': `'Source Code Pro', 'Consolas', 'Inconsolata', 'Droid Sans Mono', 'Monaco', monospace`,
          'request.credentials': 'omit',
        },
      }),
    ],
  });

  await server.start();

  server.applyMiddleware({ app, path: '/graphql' });

  await new Promise((resolve) =>
    httpServer.listen({ port: process.env.PORT || 8056 }, resolve),
  );

  console.log(
    `🚀 Query endpoint ready at http://localhost:${
      process.env.SERVER_PORT || 8056
    }${server.graphqlPath}`,
  );
  console.log(
    `🚀 Subscription endpoint ready at ws://localhost:${
      process.env.SERVER_PORT || 8056
    }${server.graphqlPath}`,
  );
}
