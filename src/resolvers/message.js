const resolvers = {
  Query: {
    messages: async (parent, args, context, info) => {
      const result = await context.db
        .select('*')
        .from('message')
        .where('created_by', '3');
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
      return result;
    },
    createdAt: async (parent, args, context, info) => {
      return parent.created_at;
    },
  },
};

export default resolvers;
