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
  Mutation: {
    messageMutation: async (parent, args, context, info) => {
      return {};
    },
  },
  MessageMutation: {
    updateMessage: async (parent, args, context, info) => {
      const result = await context
        .db('message')
        .returning('*')
        .update({
          content: args.input.content,
        })
        .where('id', args.id);

      return _.first(result);
    },
    deleteMessage: async (parent, args, context, info) => {
      const result = await context
        .db('message')
        .returning('*')
        .update({ is_active: false })
        .where('id', args.id);

      return _.first(result);
    },
  },
};

export default resolvers;
