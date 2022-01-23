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

  type Query {
    messages: [Message]!
  }
`;

export default typeDefs;
