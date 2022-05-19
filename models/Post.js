const mongoose = require("mongoose");
const postSchema = new mongoose.Schema(
  {
    area: {
      type: Number,
      require: true,
    },
    price: {
      type: Number,
      require: true,
    },
    desc: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      required: true,
    },
    province: {
      id: {
        type: Number,
        required: true,
      },
      name: {
        type: String,
        default: "",
      },
    },
    district: {
      id: {
        type: Number,
        required: true,
      },
      name: {
        type: String,
        default: "",
      },
      provinceId: {
        type: Number,
      },
    },
    ward: {
      code: {
        type: Number,
        required: true,
      },
      name: {
        type: String,
      },
      districtId: {
        type: Number,
      },
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
    isHidden: {
      type: Boolean,
      default: false,
    },
    isRent: {
      type: Boolean,
      default: false,
    },
    rooms: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
      },
    ],
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    favoriteCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
