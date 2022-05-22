import _ from 'lodash';

const resolvers = {
  Query: {
    userQuery: async (parent, args, context) => {
      return [];
    },
  },
  UserQuery: {
    users: async (parent, args, context, info) => {
      const filter = args.filter ?? {};

      const query = context.db
        .select('*')
        .from('user')
        .where({ is_active: true });

      if (!_.isEmpty(filter.ids)) {
        query.whereIn('id', filter.ids);
      }

      return await query;
    },
  },
  User: {
    id: async (parent, args, context, info) => {
      return parent.id;
    },
    firstName: async (parent, args, context, info) => {
      return parent.first_name;
    },
    lastName: async (parent, args, context, info) => {
      return parent.last_name;
    },
    createdAt: async (parent, args, context, info) => {
      return parent.created_at;
    },
    chats: async (parent, args, context, info) => {
      const result = await context.db
        .select('*')
        .from('map_user_chat')
        .join('chat', { 'map_user_chat.fk_chat_id': 'chat.id' })
        .where({
          'map_user_chat.fk_user_id': parent.id,
          'chat.is_active': true,
        });

      return result;
    },
  },
  Mutation: {
    userMutation: async (parent, args, context, info) => {
      return {};
    },
  },
  UserMutation: {
    createUser: async (parent, args, context, info) => {
      const result = await context.db('user').returning('*').insert({
        first_name: args.input.firstName,
        last_name: args.input.lastName,
      });

      return _.first(result);
    },
    updateUser: async (parent, args, context, info) => {
      const result = await context
        .db('user')
        .returning('*')
        .update({
          first_name: args.input.firstName,
          last_name: args.input.lastName,
        })
        .where('id', args.id);

      return _.first(result);
    },
    deleteUser: async (parent, args, context, info) => {
      const result = await context
        .db('user')
        .returning('*')
        .update({ is_active: false })
        .where('id', args.id);

      return _.first(result);
    },
  },
};

export default resolvers;
