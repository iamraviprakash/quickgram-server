import { gql } from 'apollo-server-express';

const typeDefs = gql`
  enum CONTENT_TYPE {
    LINK
    TEXT
    MEDIA
  }

  type Message {
    id: ID!
    chatId: ID!
    content: String!
    contentType: CONTENT_TYPE!
    createdBy: User!
    createdAt: String!
  }

  type MessageQuery {
    messages: [Message!]
  }

  type Query {
    messageQuery: MessageQuery
  }

  input UpdateMessageInput {
    content: String
  }

  input CreateMessageInput {
    chatId: ID!
    content: String!
    createdBy: ID!
    contentType: CONTENT_TYPE!
  }

  type MessageMutation {
    createMessage(input: CreateMessageInput!): Message!
    updateMessage(id: ID!, input: UpdateMessageInput!): Message!
    deleteMessage(id: ID!): Message!
  }

  type Mutation {
    messageMutation: MessageMutation!
  }

  type Subscription {
    newMessage(chatId: ID!): Message!
  }
`;

export default typeDefs;
