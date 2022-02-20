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

  input CreateChatInput {
    name: String!
    type: CHAT_TYPE!
    users: [ID]!
    createdBy: ID!
  }

  input UpdateChatInput {
    name: String
    usersToAdd: [ID!]
    usersToRemove: [ID!]
  }

  input CreateMessageInput {
    chatId: ID!
    content: String!
    createdBy: ID!
    contentType: CONTENT_TYPE!
  }

  type ChatMutation {
    createChat(input: CreateChatInput!): Chat!
    updateChat(id: ID!, input: UpdateChatInput!): Chat!
    deleteChat(id: ID!): Chat!
    createMessage(input: CreateMessageInput!): Message!
  }

  type Mutation {
    chatMutation: ChatMutation!
  }
`;

export default typeDefs;
