import _ from 'lodash';

const resolvers = {
  Query: {
    chatQuery: async (parent, args, context) => {
      return [];
    },
  },
  ChatQuery: {
    chats: async (parent, args, context, info) => {
      const result = await context.db.select('*').from('chat');

      return result;
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
  Mutation: {
    chatMutation: async (parent, args, context, info) => {
      return {};
    },
  },
  ChatMutation: {
    createChat: async (parent, args, context, info) => {
      const result = await context.db('chat').returning('*').insert({
        name: args.input.name,
        type: args.input.type,
        created_by: args.input.createdBy,
      });

      const chat = _.first(result);

      if (chat.type == 'GROUP') {
        const addingUsersPromises = _.map(
          args.input.users,
          async (userId) => {
            return await context.db('map_user_chat').insert({
              fk_chat_id: chat.id,
              fk_user_id: userId,
            });
          },
        );

        await Promise.all(addingUsersPromises);
      } else {
        await context.db('map_user_chat').insert({
          fk_chat_id: chat.id,
          fk_user_id: _.first(args.input.users),
        });
      }

      return chat;
    },
    updateChat: async (parent, args, context, info) => {
      let result = [];

      if (!_.isEmpty(args.input.name)) {
        result = await context
          .db('chat')
          .returning('*')
          .update({
            name: args.input.name,
          })
          .where('id', args.id);
      } else {
        result = await context
          .db('chat')
          .select('*')
          .where('id', args.id);
      }

      const chat = _.first(result);

      if (chat.type == 'GROUP') {
        const addingUsersPromises = _.map(
          args.input.usersToAdd,
          async (userId) => {
            const mappings = await context
              .db('map_user_chat')
              .select('*')
              .where({
                fk_chat_id: chat.id,
                fk_user_id: userId,
              });

            if (!_.isEmpty(mappings)) {
              await context
                .db('map_user_chat')
                .update({
                  is_active: true,
                })
                .where({
                  fk_chat_id: chat.id,
                  fk_user_id: userId,
                });
            } else {
              await context.db('map_user_chat').insert({
                fk_chat_id: chat.id,
                fk_user_id: userId,
              });
            }
          },
        );

        const removingUsersPromises = _.map(
          args.input.usersToRemove,
          async (userId) => {
            await context
              .db('map_user_chat')
              .update({
                is_active: false,
              })
              .where({
                fk_chat_id: chat.id,
                fk_user_id: userId,
              });
          },
        );

        await Promise.all([
          ...addingUsersPromises,
          ...removingUsersPromises,
        ]);
      }

      return chat;
    },
    deleteChat: async (parent, args, context, info) => {
      const result = await context
        .db('chat')
        .returning('*')
        .update({ is_active: false })
        .where('id', args.id);

      return _.first(result);
    },
  },
};

export default resolvers;
