module.exports = `
    type Note{
        id: ID!
        text: String!
        createdAt: String!
        user: User!
    }

    input CreateNoteInput{
        text: String!
    }
`;
