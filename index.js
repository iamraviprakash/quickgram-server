import startApolloServer from './server';
import typeDefs from './src/schema';
import resolvers from './src/resolvers';

startApolloServer(typeDefs, resolvers);
