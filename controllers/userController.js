const User = require("../models/User");
const Post = require("../models/Post");
const Response = require("../utils/response");
const userController = {
  getUserDetail: async (req, res, next) => {
    const { userID } = req.params;
    User.findById(userID, { password: 0 })
      //.populate({ path: "rooms", select: "thumbnail name" })
      .exec((err, user) => {
        return res.status(200).json({ result: Response(user) });
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
      result: { object: "true" },
    });
  },
};

module.exports = userController;
