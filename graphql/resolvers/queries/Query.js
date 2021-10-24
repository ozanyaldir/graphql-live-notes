module.exports = {
    user: async (parent, args, { User }) => {
        return await User.findById(args.id);
    },
    users: async (parent, args, { User }) => {
        return await User.find({}).sort({ 'createdAt': 'desc' });
    },

    note: async (parent, args, { Note }) => {
        return await Note.findById(args.id);
    },
    notes: async (parent, args, { Note }) => {
        return await Note.find({}).sort({ 'createdAt': 'desc' });
    },

}