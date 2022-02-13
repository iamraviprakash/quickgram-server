import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type RootQuery {
    users: [User!]
  }

  type Query {
    rootQuery: RootQuery!
  }

  type RootMutation {
    createUser(
      firstName: String!
      lastName: String!
      emailId: String
      mobileNumber: String!
    ): User!
  }

  type Mutation {
    rootMutation: RootMutation!
  }
`;

export default typeDefs;
