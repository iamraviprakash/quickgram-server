import _ from 'lodash';

const resolvers = {
  Query: {
    messageQuery: async (parent, args, context) => {
      return [];
    },
  },
  MessageQuery: {
    messages: async (parent, args, context, info) => {
      const result = await context.db
        .select('*')
        .from('message')
        .where({ is_active: true })
        .orderBy('created_at', 'asc');

      return result;
    },
  },
  Message: {
    id: async (parent, args, context, info) => {
      return parent.id;
    },
    chatId: async (parent, args, context, info) => {
      return parent.fk_chat_id;
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
    createMessage: async (parent, args, context, info) => {
      const result = await context
        .db('message')
        .returning('*')
        .insert({
          content: args.input.content,
          content_type: args.input.contentType,
          created_by: args.input.createdBy,
          fk_chat_id: args.input.chatId,
        });

      context.pubsub.publish('NEW_MESSAGE', {
        newMessage: {
          ..._.first(result),
        },
      });

      return _.first(result);
    },
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
  Subscription: {
    newMessage: {
      subscribe: (parent, args, context, info) =>
        context.pubsub.asyncIterator(['NEW_MESSAGE']),
    },
  },
};

export default resolvers;
