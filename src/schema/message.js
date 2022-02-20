import { gql } from 'apollo-server-express';

const typeDefs = gql`
  enum CONTENT_TYPE {
    LINK
    TEXT
  }

  type Message {
    id: ID!
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

  type MessageMutation {
    updateMessage(id: ID!, input: UpdateMessageInput!): Message!
    deleteMessage(id: ID!): Message!
  }

  type Mutation {
    messageMutation: MessageMutation!
  }
`;

export default typeDefs;
