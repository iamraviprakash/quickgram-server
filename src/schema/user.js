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
    user: User!
  }

  type Query {
    userQuery: UserQuery!
  }

  input UpdateUserInput {
    firstName: String
    lastName: String
    emailId: String
    mobileNumber: String
    password: String
  }

  type UserMutation {
    updateUser(id: ID!, input: UpdateUserInput!): User!
    deleteUser(id: ID!): User!
  }

  type Mutation {
    userMutation: UserMutation!
  }
`;

export default typeDefs;
