const User = require("../models/User");
const Post = require("../models/Post");
const Response = require("../utils/response");
const userController = {
  getAllUsers: async (req, res, next) => {
    const { userID } = req.params;
    User.find({}, { password: 0 })
      //.populate({ path: "rooms", select: "thumbnail name" })
      .exec((err, users) => {
        return res.status(200).json({ result: Response(users) });
      });
  },
  getUserDetail: async (req, res, next) => {
    const { userID } = req.params;
    User.findById(userID, { password: 0 })
      //.populate({ path: "rooms", select: "thumbnail name" })
      .exec((err, user) => {
        return res.status(200).json({ result: Response(user) });
      });
  },
  getListFollow: async (req, res, next) => {
    queryString = req.query;
    const { userID } = req.params;
    const user = await User.findById(userID);
    const listFollow = user.follows;

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
    let idQueryObj = { _id: { $in: listFollow } };
    condition = { ...condition, ...idQueryObj };
    //console.log(condition);
    //end of convert
    Post.find(condition)
      .skip(skipCount)
      .limit(limit)
      .sort(sort)
      .populate({ path: "rooms", select: "imgUrl mainThumbnail name" })
      .exec((err, posts) => {
        return res.status(200).json({ result: Response(posts) });
      });
  },

  //GET ALL USER
  updateUser: async (req, res, next) => {
    const { userID } = req.params;
    const updateObject = req.body;
    await User.updateOne({ _id: userID }, { $set: updateObject })
      .exec()
      .then(() => {
        res.status(200).json({
          result: { object: updateObject },
        });
      });
  },
  updateUsers: async (req, res, next) => {
    const updateObject = req.body;
    await User.updateMany({}, { $set: updateObject })
      .exec()
      .then(() => {
        res.status(200).json({
          result: { object: updateObject },
        });
      });
  },

  //DELETE A USER
  deleteUser: async (req, res, next) => {
    const { userID } = req.params;
    await User.deleteOne({ _id: userID })
      .exec()
      .then((deletedCount) => {
        let a = deletedCount.deletedCount;
        return res.status(200).json({
          result: {
            object: updateObject,
          },
        });
      });
  },

  //follow post
  followPost: async (req, res, next) => {
    const { userID } = req.params;
    const { postId, isFavorite } = req.body;

    const user = await User.findById(userID);
    const post = await Post.findById(postId);
    if (isFavorite) {
      const index = user.follows.indexOf(post._id);
      if (index > -1) {
        return res.status(500).json({
          error: "Bạn đã follow post này!",
        });
      }
      user.follows.push(postId);
      post.favoriteCount += 1;
    } else {
      const index = user.follows.indexOf(post._id);
      if (index > -1) {
        user.follows.splice(index, 1); // 2nd parameter means remove one item only
        post.favoriteCount -= 1;
      }
    }
    await user.save();
    await post.save();
    return res.status(200).json({
      result: {
        object: {
          message: "ok",
        },
      },
    });
  },
};

module.exports = userController;
