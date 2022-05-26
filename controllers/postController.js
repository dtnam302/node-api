const Post = require("../models/Post");
const Room = require("../models/Room");
const Hotspot = require("../models/Hotspot");
const User = require("../models/User");
const { uploadImage, deleteImage } = require("../utils/upload");
const Response = require("../utils/response");

const postController = {
  //CREATE A POST
  createPost: async (req, res, next) => {
    const { userID } = req.params;
    let { image_descriptions, ...body } = req.body;
    const files = req.files;
    if (typeof image_descriptions === "string") {
      image_descriptions = [image_descriptions];
    }

    const user = await User.findById(userID);
    if (user) {
      const newPost = Post(body);
      newPost.creatorId = userID;
      await newPost.save();
      user.posts.push(newPost._id);
      await user.save();
      const postID = newPost._id;
      const folder = postID;
      const post = await Post.findById(postID);

      const urls = await uploadImage(files, image_descriptions, folder);
      for (const room_body of urls) {
        const newRoom = new Room(room_body);
        newRoom.postId = postID;
        await newRoom.save();
        post.rooms.push(newRoom._id);
      }
      await post.save();
      Post.findOne({ _id: postID })
        .populate({ path: "rooms", select: "name imgUrl" })
        .exec((err, post) => {
          return res.status(200).json({ result: Response(post) });
        });
    }
  },
  createHotspot: async (req, res, next) => {
    //refact to hotspotController
    const { roomID } = req.params;
    const room = await Room.findById(roomID);
    const hotspots = req.body;
    let hotspotIds = [];
    for (const hotspot of hotspots) {
      const newHotspot = new Hotspot(hotspot);
      await newHotspot.save();
      hotspotIds.push(newHotspot._id);
    }
    room.hotspots = hotspotIds;
    await room.save();
    Room.findOne({ _id: roomID })
      .populate({ path: "hotspots", select: "_id" })
      .exec((err, room) => {
        return res.status(200).json({ result: Response(room) });
      });
  },
  createThumbnail: async (req, res, next) => {
    const { roomID } = req.params;
    const room = await Room.findById(roomID);
    const files = req.files;
    const folder = `${room.postId}/${roomID}`;
    const urls = await uploadImage(files, "", folder);
    //console.log(folder, urls);

    let thumbnailsUrl = [];
    for (const url of urls) {
      thumbnailsUrl.push({
        imgUrl: url.imgUrl,
        publicId: url.publicId,
      });
    }
    room.thumbnail = thumbnailsUrl;
    room.mainThumbnail = thumbnailsUrl[0];
    await room.save();
    Room.findOne({ _id: roomID }, { hotspots: 0 }).exec((err, room) => {
      return res.status(200).json({ result: Response(room) });
    });
  },

  createMainThumbnail: async (req, res, next) => {
    const { roomID } = req.params;
    const room = await Room.findById(roomID);
    const { mainThumbnailUrl, mainThumbnailPublicId } = req.body;
    room.mainThumbnail = {
      imgUrl: mainThumbnailUrl,
      publicId: mainThumbnailPublicId,
    };
    await room.save();
    Room.findOne({ _id: roomID }, { hotspots: 0 }).exec((err, room) => {
      return res.status(200).json({ result: Response(room) });
    });
  },

  createRemoveImg: async (req, res, next) => {
    const { roomID } = req.params;
    const room = await Room.findById(roomID);
    const files = req.files;
    const folder = `${room.postId}/${roomID}`;
    const urls = await uploadImage(files, "", folder);
    console.log(room);
    room.removedImg = {
      imgUrl: urls[0].imgUrl,
      publicId: urls[0].publicId,
    };
    await room.save();
    Room.findOne({ _id: roomID }, { hotspots: 0 }).exec((err, room) => {
      return res.status(200).json({ result: Response(room) });
    });
  },

  //GET ALL POSTS
  getAllPosts: async (req, res, next) => {
    body = req.body;
    let perPage = body.perPage || 10;
    let skipCount = body.skipCount || 0;

    if (body) {
      Post.find({}, { rooms: 0 })
        .skip(skipCount)
        .limit(perPage)
        //.populate({path:"rooms",select:"imgUrl"})
        .exec((err, posts) => {
          return res.status(200).json({ result: Response(posts) });
        });
    } else {
      Post.find({}, { rooms: 0 })
        //.populate({path:"rooms",select:"imgUrl"})
        .exec((err, posts) => {
          return res.status(200).json({ result: Response(posts) });
        });
    }
  },

  getPostDetail: async (req, res, next) => {
    const { postID } = req.params;
    Post.findById(postID)
      .populate({ path: "rooms", select: "thumbnail name imgUrl" })
      .exec((err, post) => {
        return res.status(200).json({ result: Response(post) });
      });
  },

  getPostsFilter: async (req, res, next) => {
    queryString = req.query;
    //console.log(queryString);

    if (queryString) {
      //convert from query to filtering object
      const page = queryString.page * 1 || 1;
      const limit = queryString.limit * 1 || 10;
      const skipCount = limit * (page - 1);
      const sort = queryString.sort || "-createdAt";
      const queryObj = { ...queryString };
      const excludedFields = ["page", "sort", "limit", "search"];
      excludedFields.forEach((el) => delete queryObj[el]);

      let condition = {};

      for (let [key, childObj] of Object.entries(queryObj)) {
        //console.log(childObj);
        for (let [k, v] of Object.entries(childObj)) {
          //console.log(k, v);
          if (k != "regex") {
            k = "$" + k;
            tempObj = {};
            tempObj[k] = v;
            condition[key] = condition[key]
              ? { ...condition[key], ...tempObj }
              : tempObj;
          } else {
            v = new RegExp(v, "i");
            condition[key] = v;
          }
        }
      }
      //end of convert
      Post.find(condition)
        .skip(skipCount)
        .limit(limit)
        .sort(sort)
        .populate({ path: "rooms", select: "imgUrl mainThumbnail name" })
        .exec((err, posts) => {
          return res.status(200).json({ result: Response(posts) });
        });
    } else {
      Post.find({})
        //.sort(sort)
        .populate({ path: "rooms", select: "imgUrl mainThumbnail name" })
        .exec((err, posts) => {
          return res.status(200).json({ result: Response(posts) });
        });
    }
  },

  updatePost: async (req, res, next) => {
    const { postID } = req.params;
    const updateObject = req.body;
    await Post.updateOne({ _id: postID }, { $set: updateObject })
      .exec()
      .then(() => {
        res.status(200).json({ result: Response(updateObject) });
      });
  },

  updateAllPosts: async (req, res, next) => {
    const updateObject = req.body;
    await Post.updateMany({}, { $set: updateObject })
      .exec()
      .then(() => {
        res.status(200).json({ result: Response(updateObject) });
      });
  },

  deletePost: async (req, res, next) => {
    const { postID } = req.params;
    const post = await Post.findById(postID);
    for (const room of post.rooms) {
      const room_ele = await Room.findById(room.toString());
      await deleteImage(room_ele.publicId);
      await Room.findByIdAndDelete(room.toString());
    }
    await Post.deleteOne({ _id: postID })
      .exec()
      .then((deletedCount) => {
        let a = deletedCount.deletedCount;
        return res.status(200).json({
          result: { object: { message: "ok" } },
        });
      });
  },

  deletePosts: async (req, res, next) => {
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
