const bcrypt = require('bcrypt');
const jwtHelper = require('../../helpers/jwt')

module.exports = {
    signIn: async (parent, { data: { username, password } }, { User }) => {
        const user = await User.findOne({ username: username })
        if (!user)
            throw new Error('User not found!')

        const isValidPassword = await bcrypt.compare(password, user.password)
        if (!isValidPassword)
            throw new Error('Invalid password!')

        return {
            token: jwtHelper.generate(user, '1d')
        }
    },
    signUp: async (parent, { data: { username, password } }, { User }) => {
        const user = await User.findOne({ username: username })
        if (user)
            throw new Error('User already exists!')

        const newUser = await new User({
            username: username,
            password: password
        }).save()

        return {
            token: jwtHelper.generate(newUser, '1d')
        }
    },

}
