import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type User {
    id: ID!
    firstName: String!
    lastName: String
    emailId: String!
    mobileNumber: String!
    createdAt: String!
    chats: [Chat!]
  }

  type UserQuery {
    users: [User!]
  }

  type Query {
    userQuery: UserQuery!
  }

  input CreateUserInput {
    firstName: String!
    lastName: String
    emailId: String!
    password: String!
    mobileNumber: String!
  }

  input UpdateUserInput {
    firstName: String
    lastName: String
    emailId: String
    mobileNumber: String
    password: String
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
