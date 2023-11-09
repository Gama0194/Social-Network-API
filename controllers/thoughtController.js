const { User, Thought } = require('../models');

module.exports = {
    // Get all thoughts 
    async getThoughts( req, res) {
        try {
            const thoughts = await Thought.find();
            res.json(thoughts);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // Get a single thought by its id
    async getSingleThought(req, res) {
        try {
            const thought = await Thought.findOne({ _id: req.params.thoughtId})
            .select('-__v');

            if(!thought) {
                return res.status(404).json({ message: 'No thought with that ID'});
            }
            
            res.json(thought);
           } catch (err) {
            res.status(500).json(err);
           }
    },
    // Create a new thought
    async createThought (req, res){
        try {
            const thought = await Thought.create(req.body);
            const user = await User.findByIdAndUpdate(
                req.body.userId,
                { $push: {thoughts: _id}},
                {runValidators: true, new: true}
            );
            return res.status(200).json({ thought, user});
           } catch (err) {
             console.log(err);
             return res.status(500).json(err);
        }
    },
    // Update thought by ID
    async updateThought( req, res ) {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId},
                { $set: req.body},
                { runValidators: true, new: true}
            );

            if(!thought){
                res.status(404).json({ message: 'No thought with this ID'});
            }
            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // Delete a thought by ID
    async deleteThought(req, res){
        try {
            const thought = await Thought.findOneAndRemove(
                { _id: req.params.thoughtId},
                { $pull: { thoughts: _id}},
                { new: true },
            );
            if(!thought) {
                return res.status(404).json({ message: 'No thought with the ID found'});
            }
                return res.status(200).json({ message: 'Thought deleted'});
       
            } catch (err){
                console.log(err);
                return res.status(500).json(err);
            }
    },
    // Create reaction 
    async createReaction(req, res){
    try {
        const thought = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: { reaction: req.body }},
            {runValidators: true, new: true}, 
        );
        if(!thought){
            return res.status(404) .json({message: 'No thought found with that ID'});
        }
        res.json(thought);
      } catch (err) {
        res.status(500).json(err);
      }
    },
    // Delete reaction by reaction ID
    async deleteReaction(req, res){
    try {
        const thought = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId},
            { $pull: { reaction: {reactionId: req.params.reactionId}}},
            { runValidators: true, new: true}
        );
        if(!thought){
            return res.status(404).json({ message: 'No thought found with that ID'});
        }
        res.json(thought);
      } catch (err) {
        res.status(500).json(err);
      }
    },

};

module.exports = thoughtController;