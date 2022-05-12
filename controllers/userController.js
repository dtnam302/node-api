const User = require("../models/User");
const Response = require("../utils/response");
const userController = {
  getUserDetail: async (req, res, next) => {
    const { userID } = req.params;
    User.findById(userID)
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
          updateUser: updateObject,
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
          message: `${a} user success delete`,
        });
      });
  },
};

module.exports = userController;
