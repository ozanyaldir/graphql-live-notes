module.exports = {
    me: async (parent, args, { User, jwtPayload }) => {
        if (!jwtPayload)
            throw new Error('Invalid token!')
        const user = await User.findOne({ username: jwtPayload.username })
        if (!user)
            throw new Error('User not found!')

        return user
    },
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