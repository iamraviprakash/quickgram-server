import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type RootQuery {
    users: [User!]
  }

  type Query {
    rootQuery: RootQuery!
  }

  input CreateUserInput {
    firstName: String!
    lastName: String
    emailId: String!
    password: String!
    mobileNumber: String!
  }

  type RootMutation {
    createUser(input: CreateUserInput!): User!
  }

  type Mutation {
    rootMutation: RootMutation!
  }
`;

export default typeDefs;
