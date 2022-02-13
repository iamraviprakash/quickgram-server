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
    messages: [Message]!
  }

  type Query {
    messageQuery: MessageQuery
  }

  type MessageMutation {
    updateMessage(id: ID!, content: String!): Message!
    deleteMessage(id: ID!): Message!
  }

  type Mutation {
    messageMutation: MessageMutation!
  }
`;

export default typeDefs;
