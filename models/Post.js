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
      },
    },
    district: {
      id: {
        type: Number,
        required: true,
      },
      name: {
        type: String,
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
    thumbnail:{
      type:String,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
