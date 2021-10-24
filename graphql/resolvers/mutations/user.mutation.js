const bcrypt = require('bcrypt');

module.exports = {
    signIn: async (parent, { data: { username, password } }, { User }) => {
        const user = await User.findOne({ username: username })
        if (!user)
            throw new Error('User not found!')

        const isValidPassword = await bcrypt.compare(password, user.password)
        if (!isValidPassword)
            throw new Error('Invalid password!')

        return {
            token: user.username,
            createdAt: user.createdAt
        }
    },
    createUser: async (parent, { data: { username, password } }, { User }) => {
        const user = await User.findOne({ username: username })
        if (user)
            throw new Error('User already exists!')
        return await new User({
            username: username,
            password: password
        }).save()
    },

}
