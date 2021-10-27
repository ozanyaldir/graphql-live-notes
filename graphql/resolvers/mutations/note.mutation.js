
module.exports = {
    createNote: async (parent, { data: { text } }, { User, Note, jwtPayload, pubsub }) => {
        if (!jwtPayload || !jwtPayload.username)
            throw new Error('Invalid token!')
        const user = await User.findOne({ username: jwtPayload.username })
        if (!user)
            throw new Error('User not found!')
        const note = await new Note({
            user_id: user.id,
            text: text
        }).save()
        pubsub.publish()

        pubsub.publish('note', { note });
        return note
    }
}
