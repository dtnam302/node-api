const Post = require("../models/Post");
const Room = require("../models/Room");
const Hotspot = require("../models/Hotspot");
const User = require("../models/User");
const uploadImage = require("../utils/upload");

const postController = {
  //CREATE A POST
  createAnoPost: async (req, res, next) => {
    // Find owner
    const { userID } = req.params;
    body = req.body;
    // if (body.posts == null) {
    //   body.posts = [];
    // }
    const user = await User.findById(userID);
    if (user) {
      const newPost = Post(body);
      newPost.creatorId = userID;
      await newPost.save();
      user.posts.push(newPost._id);
      await user.save();
      return res.status(200).json({ post: newPost });
    }
  },
  uploadImage2AnoPost: async (req, res, next) => {
    const { postID } = req.params;
    const files = req.files;
    const folder = postID;

    const post = await Post.findById(postID);

    const urls = await uploadImage(files, folder);
    for (const room_body of urls) {
      const newRoom = new Room(room_body);
      newRoom.postId = postID;
      await newRoom.save();
      post.rooms.push(newRoom._id);
    }
    await post.save();
    return res.status(200).json({ post: post });
  },
  createHotspot: async (req, res, next) => {
    const { roomID } = req.params;

    const room = await Room.findById(roomID);
    const hotspots = req.body;

    for (const hotspot of hotspots) {
      const newHotspot = new Hotspot(hotspot);
      await newHotspot.save();
      room.hotspots.push(newHotspot._id);
    }
    await room.save();
    return res.status(200).json({ room: room });
  },
  createThumbnail: async (req, res, next) => {
    const { roomID } = req.params;
    const room = await Room.findById(roomID);
    const files = req.files;
    const folder = room.postId;
    const urls = await uploadImage(files, folder);
    room.thumbnail = urls[0].imgUrl;
    await room.save();
    return res.status(200).json({ room: room });
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

module.exports = postController;
