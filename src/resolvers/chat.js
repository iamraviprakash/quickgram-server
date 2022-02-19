import _ from 'lodash';

const resolvers = {
  Query: {
    chatQuery: async (parent, args, context) => {
      return [];
    },
  },
  ChatQuery: {
    chat: async (parent, args, context, info) => {
      const result = await context.db
        .select('*')
        .from('chat')
        .where('created_by', '3');

      return _.first(result);
    },
  },
  Chat: {
    id: async (parent, args, context, info) => {
      return parent.id;
    },
    name: async (parent, args, context, info) => {
      return parent.name;
    },
    users: async (parent, args, context, info) => {
      const result = await context.db
        .select('*')
        .from('map_user_chat')
        .join('user', { 'map_user_chat.fk_user_id': 'user.id' })
        .where('map_user_chat.fk_chat_id', parent.id);
      return result;
    },
    messages: async (parent, args, context, info) => {
      const result = await context.db
        .select('*')
        .from('message')
        .where('fk_chat_id', parent.id);
      return result;
    },
    type: async (parent, args, context, info) => {
      return parent.type;
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
