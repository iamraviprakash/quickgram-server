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

  type Query {
    users: [User]!
  }
`;

export default typeDefs;
