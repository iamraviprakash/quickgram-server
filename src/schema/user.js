import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type User {
    id: ID!
    firstName: String!
    lastName: String
    createdAt: String!
    chats: [Chat!]
  }

  input UserFilterInput {
    ids: [ID!]
  }

  type UserQuery {
    users(filter: UserFilterInput): [User!]
  }

  type Query {
    userQuery: UserQuery!
  }

  input CreateUserInput {
    firstName: String!
    lastName: String
  }

  input UpdateUserInput {
    firstName: String
    lastName: String
  }

  type UserMutation {
    createUser(input: CreateUserInput!): User!
    updateUser(id: ID!, input: UpdateUserInput!): User!
    deleteUser(id: ID!): User!
  }

  type Mutation {
    userMutation: UserMutation!
  }
`;

export default typeDefs;
