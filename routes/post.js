// const router = express.Router()
const express = require("express");

const router = require("express-promise-router")();
const {
  verifyToken,
  verifyTokenAndAdmin,
  verifyTokenAndUserAuthorization,
} = require("../controllers/verifyToken");

const postControllers = require("../controllers/postController");

//CREATE A NEW POST
router.post("/anopost/:userID", verifyToken, postControllers.createAnoPost);
router.put(
  "/upload2ano/:postID",
  verifyToken,
  postControllers.uploadImage2AnoPost
);
router.post(
  "/uploadhotspot/:roomID",
  verifyToken,
  postControllers.createHotspot
);
router.post(
  "/uploadthumbnail/:roomID",
  verifyToken,
  postControllers.createThumbnail
);

module.exports = router;
