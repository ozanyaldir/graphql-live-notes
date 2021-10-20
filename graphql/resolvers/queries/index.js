const user = require('./user.query.js');
const note = require('./note.query.js');

module.exports = {
    ...user,
    ...note
};