module.exports = {
    createNote: async (parent, { data: { user_id, text } }, { User, Note }) => {
        const user = await User.findById(user_id)
        if (!user)
            throw new Error('User not found!')
        return await new Note({
            user_id: user_id,
            text: text
        }).save()
    }
}
