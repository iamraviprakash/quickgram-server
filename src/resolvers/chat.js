import _ from 'lodash';
import { generateRoomCode } from '../utils';
import { ROOM_CODE_SIZE } from '../constants';

const resolvers = {
  Query: {
    chatQuery: async (parent, args, context) => {
      return [];
    },
  },
  ChatQuery: {
    chats: async (parent, args, context, info) => {
      const filter = args.filter || {};

      const query = context.db
        .select('*')
        .from('chat')
        .where({ is_active: true });

      if (!_.isEmpty(filter.ids)) {
        query.whereIn('id', filter.ids);
      }

      if (!_.isEmpty(filter.codes)) {
        query.whereIn('code', filter.codes);
      }

      return await query;
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
        .where({
          'map_user_chat.fk_chat_id': parent.id,
          'user.is_active': true,
        });

      return result;
    },
    messages: async (parent, args, context, info) => {
      const result = await context.db
        .select('*')
        .from('message')
        .where({ fk_chat_id: parent.id, is_active: true });

      return result;
    },
    code: async (parent, args, context, info) => {
      return parent.code;
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
      const roomCode = generateRoomCode({ size: ROOM_CODE_SIZE });

      const result = await context.db('chat').returning('*').insert({
        name: args.input.name,
        created_by: args.input.createdBy,
        code: roomCode,
      });

      const chat = _.first(result);

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

      return chat;
    },
    updateChat: async (parent, args, context, info) => {
      let query = null;

      if (!_.isEmpty(args.input.name)) {
        query = context.db('chat').returning('*').update({
          name: args.input.name,
        });
      } else {
        query = context.db('chat').select('*');
      }

      if (args.id) {
        query = query.where('id', args.id);
      } else {
        query = query.where('code', args.code);
      }

      const result = await query;
      const chat = _.first(result);

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
