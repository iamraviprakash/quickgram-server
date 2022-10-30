import DataLoader from 'dataloader';
import _ from 'lodash';
import model from '../model';

const batchGetChatsByUserIds = async ({ context, ids }) => {
  return model.getters.chat
    .getChatsByUserIds({
      context,
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
