import startApolloServer from './server';
import typeDefs from './src/schema/schema';
import resolvers from './src/resolvers/resolver';

startApolloServer(typeDefs, resolvers);
