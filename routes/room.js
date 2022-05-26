const roomController = require("../controllers/roomController");
const router = require("express-promise-router")();
const {
  verifyToken,
  verifyTokenAndAdmin,
  verifyTokenAndUserAuthorization,
} = require("../controllers/verifyToken");

router.post("/:postID", verifyToken, roomController.createRoom);

router.put("/:roomID", verifyToken, roomController.updateRoom);
router.put("/", verifyToken, roomController.updateAllRooms);

router.get("/:roomID", roomController.getRoomDetail);

router.delete("/:roomID", verifyToken, roomController.deleteRoom);
router.delete("/", verifyToken, roomController.deleteRooms);
module.exports = router;
