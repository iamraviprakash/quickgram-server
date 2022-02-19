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
    chat: Chat!
  }

  type Query {
    chatQuery: ChatQuery!
  }

  type ChatMutation {
    createChat(name: String!, type: CHAT_TYPE, users: [ID!]): Chat!
    updateChat(id: ID!, name: String!): Chat!
    deleteChat(id: [ID!]): [Chat!]
    addUser(userId: [ID!]): Chat!
    createMessage(
      chatId: ID!
      content: String!
      contentType: CONTENT_TYPE!
    ): Message!
  }

  type Mutation {
    chatMutation: ChatMutation!
  }
`;

export default typeDefs;
