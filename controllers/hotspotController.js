const Post = require("../models/Post");
const Room = require("../models/Room");
const Hotspot = require("../models/Hotspot");
const User = require("../models/User");
const { uploadImage, deleteImage } = require("../utils/upload");

const hotspotController = {
  //Update room
  updateHotspot: async (req, res, next) => {
    const { hotspotID } = req.params;
    const updateObject = req.body;
    await Hotspot.updateOne({ _id: hotspotID }, { $set: updateObject })
      .exec()
      .then(() => {
        return res.status(200).json({ result: Response(updateObject) });
      });
  },

  updateAllHotspots: async (req, res, next) => {
    const updateObject = req.body;
    await Room.updateMany({}, { $set: updateObject })
      .exec()
      .then(() => {
        return res.status(200).json({ result: Response(updateObject) });
      });
  },

  //   //Room detail
  //   getRoomDetail: async (req, res, next) => {
  //     const { roomID } = req.params;
  //     Room.findById(roomID)
  //       .populate("hotspots")
  //       .exec((err, room) => {
  //         return res.status(200).json({ result: Response(room) });
  //       });
  //   },

  //Delete room
  deleteHotspot: async (req, res, next) => {
    const { hotspotID } = req.params;
    const hotspot = await Hotspot.findById(hotspotID);
    const curRoom = await Room.findById(hotspot.currentRoom);
    const nextRoom = await Room.findById(hotspot.nextRoom);

    const indexCur = curRoom.hotspots.indexOf(hotspot._id);
    if (indexCur > -1) {
      curRoom.hotspots.splice(indexCur, 1); // 2nd parameter means remove one item only
    }
    const indexNext = nextRoom.hotspots.indexOf(hotspot._id);
    if (indexNext > -1) {
      nextRoom.hotspots.splice(indexNext, 1); // 2nd parameter means remove one item only
    }

    await Hotspot.deleteOne({ _id: hotspotID })
      .exec()
      .then((deletedCount) => {
        let a = deletedCount.deletedCount;
        return res.status(200).json({
          message: `${a} hotspot success delete`,
        });
      });
  },
  //   deleteRooms: async (req, res, next) => {
  //     let toDelete = [];
  //     for (const ele in req.body) {
  //       const room = await Room.findById(req.body[ele]);
  //       await deleteImage(room.publicId);
  //       toDelete.push(req.body[ele]);
  //     }
  //     const filter = { $in: toDelete };
  //     await Room.deleteMany({ _id: filter })
  //       .exec()
  //       .then((deletedCount) => {
  //         let a = deletedCount.deletedCount;
  //         return res.status(200).json({
  //           message: `${a} room success delete`,
  //         });
  //       });
  //   },
};

module.exports = hotspotController;
