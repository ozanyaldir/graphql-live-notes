const user = require('./user.mutation.js');
const note = require('./note.mutation.js');

module.exports = {
    ...user,
    ...note
};