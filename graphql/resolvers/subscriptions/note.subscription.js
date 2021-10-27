
// const Note = require('../../../models/Note');
// const { PubSub } = require('graphql-subscriptions');
const { withFilter } = require('graphql-subscriptions');
// const pubsub = new PubSub();

module.exports = {
    note: {
        subscribe: withFilter(
            (parent, args, { pubsub, jwtPayload }) => {
                return pubsub.asyncIterator(['note'])
            },
            (payload, variables) => {
                return variables.user_id ? (payload.note.user_id == variables.user_id) : true;
            },
        ),
    },

}