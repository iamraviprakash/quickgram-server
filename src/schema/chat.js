import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Chat {
    id: ID!
    name: String!
    users: [User]!
    messages: [Message!]
    code: String!
    createdBy: User!
    createdAt: String!
  }

  input ChatFilterInput {
    ids: [ID!]
    codes: [String!]
  }

  type ChatQuery {
    chats(filter: ChatFilterInput): [Chat!]
  }

  type Query {
    chatQuery: ChatQuery!
  }

  input CreateChatInput {
    name: String!
    users: [ID]!
    createdBy: ID!
  }

  input UpdateChatInput {
    name: String
    usersToAdd: [ID!]
    usersToRemove: [ID!]
  }

  type ChatMutation {
    createChat(input: CreateChatInput!): Chat!
    updateChat(id: ID, code: String, input: UpdateChatInput!): Chat!
    deleteChat(id: ID!): Chat!
  }

  type Mutation {
    chatMutation: ChatMutation!
  }

  type Subscription {
    userAdded(chatId: ID!): User!
  }
`;

export default typeDefs;
