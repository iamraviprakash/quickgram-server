import DataLoader from 'dataloader';
import _ from 'lodash';

const batchGetUsersByChatIds = ({ context, ids }) => {
  return context.model.getters.user
    .getUsersByChatIds({ ids })
    .then((rows) => {
      return _.map(ids, (id) =>
        _.filter(rows, (row) => row.fk_chat_id == id),
      );
    });
};

export default (context) => ({
  user: {
    getUsersByChatIds: new DataLoader((ids) =>
      batchGetUsersByChatIds({ context, ids }),
    ),
  },
});
