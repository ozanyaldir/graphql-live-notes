module.exports = `
    type Note{
        text: String!
        createdAt: String!
        user: User!
    }

    input CreateNoteInput{
        text: String!
    }
`;
