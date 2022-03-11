import { ApolloServer } from 'apollo-server-express';
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageGraphQLPlayground,
} from 'apollo-server-core';
import express from 'express';
import http from 'http';
import dataSourceClient from './model';
import depthLimit from 'graphql-depth-limit';
import costAnalysis from 'graphql-cost-analysis';
import {
  SERVER_TIMEOUT,
  MAXIMUM_QUERY_DEPTH,
  MAXIMUM_SERVER_CONNECTIONS,
  MAXIMUM_GRAPHQL_REQUEST_COST,
} from './constants';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';

import { PubSub } from 'graphql-subscriptions';

export default async function startServer({ schema }) {
  // Integrating with Express app
  const app = new express();
  const httpServer = http.createServer(app);

  // HTTP server configuration
  httpServer.timeout = SERVER_TIMEOUT;
  httpServer.maxConnections = MAXIMUM_SERVER_CONNECTIONS;

  // Create web socket server
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
  });

  // Save the returned server's info so we can shutdown this server later
  const wsServerInstance = useServer({ schema }, wsServer);

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
      pubsub: new PubSub(),
    }),
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
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
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await wsServerInstance.dispose();
            },
          };
        },
      },
    ],
  });

  await server.start();

  server.applyMiddleware({ app });

  await new Promise((resolve) =>
    httpServer.listen({ port: process.env.PORT || 8056 }, resolve),
  );

  console.log(
    `🚀 Server ready at http://localhost:${
      process.env.SERVER_PORT || 8056
    }${server.graphqlPath}`,
  );
  console.log(
    `🚀 Server ready at ws://localhost:${
      process.env.SERVER_PORT || 8056
    }${server.graphqlPath}`,
  );
}
