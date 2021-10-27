module.exports = {
    notes: async (parent, args, { Note }) => {
        return await Note.find({user_id: parent.id}).sort({ 'createdAt': 'desc' });
    },
}