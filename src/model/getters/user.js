const getUsersByChatIds = async ({ context, ids }) => {
  return context.db
    .select('*')
    .from('map_user_chat')
    .join('user', { 'map_user_chat.fk_user_id': 'user.id' })
    .where({
      'user.is_active': true,
    })
    .whereIn('map_user_chat.fk_chat_id', ids)
    .orderBy('map_user_chat.created_at', 'desc');
};

export default (context) => ({
  user: {
    getUsersByChatIds: ({ ids }) =>
      getUsersByChatIds({ context, ids }),
  },
});
