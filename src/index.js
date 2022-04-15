import http from 'http';
import {
  SERVER_TIMEOUT,
  MAXIMUM_SERVER_CONNECTIONS,
} from './constants';
import express from 'express';
import typeDefs from './schema';
import resolvers from './resolvers';
import { makeExecutableSchema } from '@graphql-tools/schema';

import createQueryServer from './config/queryServer';
import createSubscriptionServer from './config/subscriptionServer';

const schema = makeExecutableSchema({ typeDefs, resolvers });

// Create Express app
const app = new express();
const httpServer = http.createServer(app);

// HTTP server configuration
httpServer.timeout = SERVER_TIMEOUT;
httpServer.maxConnections = MAXIMUM_SERVER_CONNECTIONS;

(async () => {
  // Create servers
  const subscriptionServer = await createSubscriptionServer({
    schema,
    httpServer,
  });
  const queryServer = await createQueryServer({
    schema,
    httpServer,
    subscriptionServer,
  });

  // Start servers
  await queryServer.start();
  queryServer.applyMiddleware({ app, path: '/graphql' });

  // Listen to the port
  await new Promise((resolve) =>
    httpServer.listen({ port: process.env.PORT || 8056 }, resolve),
  );

  console.log(
    `🚀 Query endpoint ready at http://localhost:${
      process.env.SERVER_PORT || 8056
    }${queryServer.graphqlPath}`,
  );
  console.log(
    `🚀 Subscription endpoint ready at ws://localhost:${
      process.env.SERVER_PORT || 8056
    }${queryServer.graphqlPath}`,
  );
})();
