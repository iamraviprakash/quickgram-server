import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type RootQuery {
    users: [User!]
  }

  type Query {
    rootQuery: RootQuery!
  }
`;

export default typeDefs;
