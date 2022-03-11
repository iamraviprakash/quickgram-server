import startServer from './server';
import typeDefs from './src/schema';
import resolvers from './src/resolvers';
import { makeExecutableSchema } from '@graphql-tools/schema';

const schema = makeExecutableSchema({ typeDefs, resolvers });

startServer({ schema });
