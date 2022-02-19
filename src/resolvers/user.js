import _ from 'lodash';

const resolvers = {
  Query: {
    userQuery: async (parent, args, context) => {
      return [];
    },
  },
  UserQuery: {
    user: async (parent, args, context, info) => {
      const result = await context.db
        .select('*')
        .from('user')
        .where('id', '3');
      return result;
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
    emailId: async (parent, args, context, info) => {
      return parent.email_id;
    },
    mobileNumber: async (parent, args, context, info) => {
      return parent.mobile_number;
    },
    createdAt: async (parent, args, context, info) => {
      return parent.created_at;
    },
    chats: async (parent, args, context, info) => {
      const result = await context.db
        .select('*')
        .from('map_user_chat')
        .join('chat', { 'map_user_chat.fk_chat_id': 'chat.id' })
        .where('map_user_chat.fk_user_id', parent.id);
      return result;
    },
  },
  Mutation: {
    userMutation: async (parent, args, context, info) => {
      return {};
    },
  },
  UserMutation: {
    updateUser: async (parent, args, context, info) => {
      const result = await context
        .db('user')
        .returning('*')
        .update({
          first_name: args.firstName,
          last_name: args.lastName,
          email_id: args.emailId,
          password: args.password,
          mobile_number: args.mobileNumber,
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
