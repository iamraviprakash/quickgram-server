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
};

export default resolvers;
