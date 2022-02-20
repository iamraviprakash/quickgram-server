import { ApolloServer } from 'apollo-server-express';
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageGraphQLPlayground,
} from 'apollo-server-core';
import express from 'express';
import http from 'http';
import dataSourceClient from './model';
import depthLimit from 'graphql-depth-limit';
import { MAXIMUM_QUERY_DEPTH } from './constants';

export default async function startApolloServer(typeDefs, resolvers) {
  // Integrating with Express app
  const app = new express();
  const httpServer = http.createServer(app);

  // Apollo Server initialization
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    validationRules: [depthLimit(MAXIMUM_QUERY_DEPTH)],
    context: async ({ req }) => ({
      auth: 'handle authorization',
      db: dataSourceClient,
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
    ],
  });

  await server.start();

  server.applyMiddleware({ app, path: '/graphql' });

  await new Promise((resolve) =>
    httpServer.listen({ port: process.env.PORT || 8056 }, resolve),
  );

  console.log(
    `🚀 Server ready at http://localhost:${
      process.env.SERVER_PORT || 8056
    }${server.graphqlPath}`,
  );
}
