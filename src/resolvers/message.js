import _ from 'lodash';
import { withFilter } from 'graphql-subscriptions';

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

      context.pubsub.publish('MESSAGE_ADDED', {
        messageAdded: {
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
    messageAdded: {
      subscribe: withFilter(
        (parent, args, context, info) =>
          context.pubsub.asyncIterator(['MESSAGE_ADDED']),
        (payload, variables) => {
          return payload.messageAdded.fk_chat_id === variables.chatId;
        },
      ),
    },
  },
};

export default resolvers;
