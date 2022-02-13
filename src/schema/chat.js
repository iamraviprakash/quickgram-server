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
    type: CHAT_TYPE!
    createdBy: User!
    createdAt: String!
  }

  type ChatQuery {
    chats: [Chat]!
  }

  type Query {
    chatQuery: ChatQuery!
  }
`;

export default typeDefs;
