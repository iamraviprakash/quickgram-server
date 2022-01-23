import { gql } from 'apollo-server-express';

const typeDefs = gql`
  enum CHAT_TYPE {
    DM
    GROUP
  }

  type Chat {
    id: ID!
    name: String!
    users: [User]!
    messages: [Message!]
    type: CHAT_TYPE
    createdBy: User!
    createdAt: String!
  }

  type Query {
    chats: [Chat]!
  }
`;

export default typeDefs;