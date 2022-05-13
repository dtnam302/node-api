const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  },
  imgUrl: {
    type: String,
    required: true,
  },
  publicId: {
    type: String,
    required: true,
  },
  removedImg: {
    imgUrl: {
      type: String,
    },
    publicId: {
      type: String,
    },
  },
  thumbnail: [
    {
      imgUrl: {
        type: String,
      },
      publicId: {
        type: String,
      },
    },
  ],
  mainThumbnail: {
    imgUrl: {
      type: String,
    },
    publicId: {
      type: String,
    },
  },

  hotspots: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotspot",
    },
  ],
});

module.exports = mongoose.model("Room", roomSchema);
