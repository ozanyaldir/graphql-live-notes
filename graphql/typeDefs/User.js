module.exports = `
    type User{
        username: String!
        createdAt: String!
        notes: [Note!]!
    }

    input SignUpInput{
        username: String!
        password: String!
    }

    input SignInInput{
        username: String!
        password: String!
    }

    type Token{
        token: String!
    }
`;
