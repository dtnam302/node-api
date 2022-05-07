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
  removeImgUrl: {
    type: String,
  },
  thumbnail: [
    {
      thumbnailUrl: {
        type: String,
      },
      thumbnailPublicId: {
        type: String,
      },
    },
  ],
  mainThumbnail: {
    mainThumbnailUrl: {
      type: String,
    },
    mainThumbnailPublicId: {
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
