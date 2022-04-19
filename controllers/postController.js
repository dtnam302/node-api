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
    const desc = req.body.descriptions;
    const folder = postID;
    const post = await Post.findById(postID);

    console.log(files);

    const urls = await uploadImage(files, desc, folder);
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

  //GET ALL POSTS
  getAllPosts: async (req, res, next) => {
    body = req.body;

    let perPage = body.perPage || 10;
    let skipCount = body.skipCount || 0;

    if(body){
    Post.find({},{rooms:0})
      .skip(skipCount)
      .limit(perPage)
      //.populate({path:"rooms",select:"imgUrl"})
      .exec((err, posts) => {
        Post.countDocuments((err, count) => {
          return res.status(200).json({ Posts: posts, Count: count });
        });
      });
    } else {
      Post.find({},{rooms:0})
      //.populate({path:"rooms",select:"imgUrl"})
      .exec((err, posts) => {
        Post.countDocuments((err, count) => {
          return res.status(200).json({ Posts: posts, Count: count });
        });
      });
    }
    
  },

  getPostDetail: async (req, res, next) => {
    const {postID} = req.params;
    Post.findById(postID)
    .populate({path:"rooms",select:"thumbnail name"})
    .exec((err, post) => {
      return res.status(200).json({ PostDetail: post});
    })
  },

  updatePost: async (req, res, next) => {
    const { postID } = req.params;
    const updateObject = req.body;
    await Post.updateOne({ _id: postID }, { $set: updateObject })
      .exec()
      .then(() => {
        res.status(200).json({
          updatePost: updateObject,
        });
      });
  },

  updateAllPosts: async (req, res, next) => {
    const updateObject = req.body;
    await Post.updateMany({}, { $set: updateObject })
      .exec()
      .then(() => {
        res.status(200).json({
          updatePost: updateObject,
        });
      });
  },

  deletePost: async (req, res, next) => {
    const { postID } = req.params;
    await Post.deleteOne({ _id: postID })
      .exec()
      .then((deletedCount) => {
        let a = deletedCount.deletedCount;
        return res.status(200).json({
          message: `${a} post success delete`,
        });
      });
  },

  delelePosts: async (req, res, next) => {
    let toDelete = [];
    for (const ele in req.body) {
      toDelete.push(req.body[ele]);
    }
    const filter = { $in: toDelete };
    await Post.deleteMany({ _id: filter })
      .exec()
      .then((deletedCount) => {
        let a = deletedCount.deletedCount;
        return res.status(200).json({
          message: `${a} post success delete`,
        });
      });
  },
};

module.exports = postController;
