
export const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json(err);
    }
};

export const getSingleUser = async (req, res) => {
    try {
        const user = await User.findOne({_id: req.params.userId})
            .populate('thoughts')
            .populate('friends')
            .select('-__v');

        if (!user) {
            return res.status(404).json({ message: 'No user with that ID' });
        }

        res.json(user);
    } catch (err) {
        res.status(500).json(err);
    }
};

export const createUser = async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.json(user);
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
};

export const updateUser = async (req, res) => {
    try {
        const user = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $set: req.body },
            { runValidators: true, new: true }
        );
        if (!user) {
            return res.status(404).json({ message: 'No user with this id!'});
        }
        res.json(user);
    } catch (err) {
        res.status(500).json(err);
    }
};

export const deleteUser = async (req, res) => {
    try {
        const user = await User.findOneAndDelete({ _id: req.params.userId });
        if(!user) {
            return res.status(404).json({ message: 'No user with that ID'});
        }
        res.json(user);
    } catch (err) {
        res.status(500).json(err);
    }
};

export const addFriend = async (req, res) => {
    try {
        const user = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $addToSet: { friends: req.body} },
            { runValidators: true, new: true}
        );

        if(!user){
            return res.status(404)
                .json({message: 'No user found with that ID'})
        }
        res.json(user);
    } catch (err) {
        res.status(500).json(err);
    }
};

export const removeFriend = async (req, res) => {
    try { 
        const user = await User.findOneAndUpdate(
            { _id: req.params.userId},
            { $pull: { friends: {friendId: req.params.friendId}}},
            { runValidators: true, new: true }
        );

        if(!user){
            return res.status(404)
                .json({message: 'No user found with that ID'});
        }

        res.json(user);
    } catch (err){
        res.status(500).json(err);
    }
};