module.exports = {
    createNote: async (parent, { data: { user_id, text } }, { Note }) => {
        return await new Note({
            user_id: user_id,
            text: text
        }).save()
    }
}
