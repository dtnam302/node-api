const Post = require("../models/Post");
const Room = require("../models/Room");
const Hotspot = require("../models/Hotspot");
const User = require("../models/User");
const { uploadImage, deleteImage } = require("../utils/upload");
const Response = require("../utils/response");
const roomController = {
  //Update room
  updateRoom: async (req, res, next) => {
    const { roomID } = req.params;
    const updateObject = req.body;
    await Room.updateOne({ _id: roomID }, { $set: updateObject })
      .exec()
      .then(() => {
        return res.status(200).json({ result: Response(updateObject) });
      });
  },

  updateAllRooms: async (req, res, next) => {
    const updateObject = req.body;
    await Room.updateMany({}, { $set: updateObject })
      .exec()
      .then(() => {
        return res.status(200).json({ result: Response(updateObject) });
      });
  },

  //Room detail
  getRoomDetail: async (req, res, next) => {
    const { roomID } = req.params;
    Room.findById(roomID)
      .populate("hotspots")
      .exec((err, room) => {
        return res.status(200).json({ result: Response(room) });
      });
  },

  //Delete room
  deleteRoom: async (req, res, next) => {
    const { roomID } = req.params;
    const room = await Room.findById(roomID);
    const post = await Post.findById(room.postId);

    const index = post.rooms.indexOf(room._id);
    if (index > -1) {
      post.rooms.splice(index, 1); // 2nd parameter means remove one item only
    }

    await deleteImage(room.publicId);
    await Room.deleteOne({ _id: roomID })
      .exec()
      .then((deletedCount) => {
        let a = deletedCount.deletedCount;
        return res.status(200).json({
          result: { object: { message: "ok" } },
        });
      });
  },
  deleteRooms: async (req, res, next) => {
    let toDelete = [];
    for (const ele in req.body) {
      const room = await Room.findById(req.body[ele]);
      await deleteImage(room.publicId);
      toDelete.push(req.body[ele]);
    }
    const filter = { $in: toDelete };
    await Room.deleteMany({ _id: filter })
      .exec()
      .then((deletedCount) => {
        let a = deletedCount.deletedCount;
        return res.status(200).json({
          message: `${a} room success delete`,
        });
      });
  },
};

module.exports = roomController;
