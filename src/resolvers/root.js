import _ from 'lodash';

const resolvers = {
  Query: {
    rootQuery: async (parent, args, context) => {
      return [];
    },
  },
  RootQuery: {
    users: async (parent, args, context, info) => {
      const result = await context.db.select('*').from('user');
      return result;
    },
  },
  Mutation: {
    rootMutation: async (parent, args, context, info) => {
      return {};
    },
  },
  RootMutation: {
    createUser: async (parent, args, context, info) => {
      const result = await context.db('user').returning('*').insert({
        first_name: args.firstName,
        last_name: args.lastName,
        email_id: args.emailId,
        password: args.password,
        mobile_number: args.mobileNumber,
      });

      return _.first(result);
    },
  },
};

export default resolvers;
