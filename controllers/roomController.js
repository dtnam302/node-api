const Post = require("../models/Post");
const Room = require("../models/Room");
const Hotspot = require("../models/Hotspot");
const User = require("../models/User");
const uploadImage = require("../utils/upload");

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
    await Room.deleteOne({ _id: roomID })
      .exec()
      .then((deletedCount) => {
        let a = deletedCount.deletedCount;
        return res.status(200).json({
          message: `${a} room success delete`,
        });
      });
  },
  deleteRooms: async (req, res, next) => {
    let toDelete = [];
    for (const ele in req.body) {
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
