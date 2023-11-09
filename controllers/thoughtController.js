const { thought, user } = require('../models');

module.exports = {
    async getAllThoughts(req, res) {
        try {
            const thoughts = await thought.find({});
            res.json(thoughts);
        } catch (err) {
            console.log(err);
            res.status(400).json(err);
        }
    },
    async getSingleThought(req, res) {
        try {
            const thought = await thought.findOne({ _id: req.params.id });
            if (!thought) {
                return res.status(404).json({ message: 'No thought with this id!' });
            }
            res.json(thought);
        } catch (err) {
            console.log(err);
            res.status(400).json(err);
        }
    },
    async createThought(req, res) {
        try {
            const thought = await thought.create(req.body);
            const user = await user.findOneAndUpdate(
                { _id: req.body.userId },
                { $push: { thoughts: thought._id } },
                { new: true }
            );
            if (!user) {
                return res.status(404).json({ message: 'No user with this id!' });
            }
            res.json(thought);
        } catch (err) {
            console.log(err);
            res.status(400).json(err);
        }
    },
    async deleteThought(req, res) {
        try {
            const thought = await thought.findOneAndDelete({ _id: req.params.id });
            if (!thought) {
                return res.status(404).json({ message: 'No thought with this id!' });
            }
            const user = await user.findOneAndUpdate(
                { username: thought.username },
                { $pull: { thoughts: thought._id } },
                { new: true }
            );
            if (!user) {
                return res.status(404).json({ message: 'No user with this id!' });
            }
            res.json(thought);
        } catch (err) {
            console.log(err);
            res.status(400).json(err);
        }
    },
    async updateThought(req, res) {
        try {
            const thought = await thought.findOneAndUpdate(
                { _id: req.params.id },
                req.body,
                { new: true }
            );
            if (!thought) {
                return res.status(404).json({ message: 'No thought with this id!' });
            }
            res.json(thought);
        } catch (err) {
            console.log(err);
            res.status(400).json(err);
        }
    },
};