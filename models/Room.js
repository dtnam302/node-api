const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "",
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
      default: "",
    },
    publicId: {
      type: String,
      default: "",
    },
  },
  thumbnail: [
    {
      imgUrl: {
        type: String,
        default: "",
      },
      publicId: {
        type: String,
        default: "",
      },
    },
  ],
  mainThumbnail: {
    imgUrl: {
      type: String,
      default: "",
    },
    publicId: {
      type: String,
      default: "",
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
