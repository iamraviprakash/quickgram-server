import { ApolloServer } from 'apollo-server-express';
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageGraphQLPlayground,
} from 'apollo-server-core';
import dataSourceClient from './dataSource';
import pubsubClient from './pubsub';
import loaders from '../loaders';
import model from '../model';
import depthLimit from 'graphql-depth-limit';
import { MAXIMUM_QUERY_DEPTH } from '../constants';

export default async function createQueryServer({
  schema,
  httpServer,
  subscriptionServer,
}) {
  // Apollo Server initialization
  const queryServer = new ApolloServer({
    schema,
    introspection: process.env.NODE_ENV !== 'production',
    validationRules: [
      depthLimit(MAXIMUM_QUERY_DEPTH),
      // costAnalysis({
      //   maximumCost: MAXIMUM_GRAPHQL_REQUEST_COST,
      // }),
    ],
    context: async ({ req }) => {
      const modelContext = model({ db: dataSourceClient });
      const loadersContext = loaders({
        db: dataSourceClient,
        model: modelContext,
      });

      return {
        auth: 'handle authorization',
        db: dataSourceClient,
        pubsub: pubsubClient,
        model: modelContext,
        loaders: loadersContext,
      };
    },
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

  return queryServer;
}
