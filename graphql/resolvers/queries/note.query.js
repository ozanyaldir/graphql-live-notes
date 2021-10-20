module.exports = {
    note: async (parent, args, { Note }) => {
        return await Note.findById(args.id);
    },
    notes: async (parent, args, { Note }) => {
        return await Note.find({}).sort({ 'createdAt': 'desc' });
    }
}