
const User = require('./User.js');
const Note = require('./Note.js');

module.exports = `
    type Query{
        me: User
        user(id: ID!): User
        users: [User!]!
        note(id: ID!): Note
        notes: [Note!]!
    }

    type Mutation{
        signIn(data: SignInInput!): Token!
        signUp(data: SignUpInput!): Token!
        createNote(data: CreateNoteInput!): Note!
    }

    type Subscription{
        note(user_id: ID): Note
    }

    ${User}
    ${Note}
`