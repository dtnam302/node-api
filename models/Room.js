const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "posts",
  },
  imgUrl: {
    type: String,
    required: true,
  },
  removeImgUrl: {
    type: String,
  },
  thumbnail: {
    type: String,
    default:
      "https://img.wallpapersafari.com/desktop/1920/1080/69/77/O0l57q.jpg",
  },
  hotspots: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "hotspots",
    },
  ],
});

module.exports = mongoose.model("Room", roomSchema);
