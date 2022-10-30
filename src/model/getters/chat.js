const getChatsByUserIds = async ({ context, ids }) => {
  return context.db
    .select('*')
    .from('map_user_chat')
    .join('chat', { 'map_user_chat.fk_chat_id': 'chat.id' })
    .where({
      'chat.is_active': true,
    })
    .whereIn('map_user_chat.fk_user_id', ids);
};

export default {
  chat: {
    getChatsByUserIds,
  },
};
