import DataLoader from 'dataloader';
import _ from 'lodash';

const batchGetChatsByUserIds = async ({ context, ids }) => {
  return context.model.getters.chat
    .getChatsByUserIds({
      ids,
    })
    .then((rows) => {
      return _.map(ids, (id) =>
        _.filter(rows, (row) => row.fk_user_id == id),
      );
    });
};

export default (context) => ({
  chat: {
    getChatsByUserIds: new DataLoader(async (ids) =>
      batchGetChatsByUserIds({ context, ids }),
    ),
  },
});
