module.exports = {
    createUser: async (parent, { data: { username, password } }, { User }) => {
        const user = await User.findOne({ username: username })
        if (user)
            throw new Error('User already exists!')
        return await new User({
            username: username,
            password: password
        }).save()
    }
}
