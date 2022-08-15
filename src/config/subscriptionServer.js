import pubsubClient from './pubsub';
import dataSourceClient from './model';
import { execute, subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';

export default async function createSubscriptionServer({
  schema,
  httpServer,
}) {
  // Subscription server initialization
  const subscriptionServer = SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
      onConnect(connectionParams, webSocket, context) {
        console.log('Subscription Server Connected');
        return { pubsub: pubsubClient, db: dataSourceClient };
      },
      onDisconnect(webSocket, context) {
        console.log('Subscription Server Disconnected');
      },
    },
    { server: httpServer },
  );

  return subscriptionServer;
}
