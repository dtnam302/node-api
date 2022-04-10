const Post = require("../models/Post");
const Room = require("../models/Room");
const Hotspot = require("../models/Hotspot");
const User = require("../models/User")

const postController = {
    //CREATE A POST
    createPost: async (req,res) => {
        try {

            //do something with

        } catch (err) {
            res.status(500).json(err);
        }
    },

    findPost: async (req, res) => {
        try {

        } catch (err) {
            res.status(500).json(err);
        }
    },





    //GET ALL USER
    getAllPosts: async (req, res) => {
        try {
        const user = await Post.find();
        res.status(200).json(user);
        } catch (err) {
        res.status(500).json(err);
        }
    },

  
};

module.exports = userController;
