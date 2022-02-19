import _ from 'lodash';

const resolvers = {
  Query: {
    messageQuery: async (parent, args, context) => {
      return [];
    },
  },
  MessageQuery: {
    message: async (parent, args, context, info) => {
      const result = await context.db
        .select('*')
        .from('message')
        .where('created_by', '3');

      return _.first(result);
    },
  },
  Message: {
    id: async (parent, args, context, info) => {
      return parent.id;
    },
    content: async (parent, args, context, info) => {
      return parent.content;
    },
    contentType: async (parent, args, context, info) => {
      return parent.content_type;
    },
    createdBy: async (parent, args, context, info) => {
      const result = await context.db
        .select('*')
        .from('user')
        .where('id', parent.created_by);

      return _.first(result);
    },
    createdAt: async (parent, args, context, info) => {
      return parent.created_at;
    },
  },
};

export default resolvers;
