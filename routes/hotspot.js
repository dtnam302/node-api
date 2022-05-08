const hotspotController = require("../controllers/hotspotController");
const router = require("express-promise-router")();
const {
  verifyToken,
  verifyTokenAndAdmin,
  verifyTokenAndUserAuthorization,
} = require("../controllers/verifyToken");

router.put("/:hotspotID", verifyToken, hotspotController.updateHotspot);
router.put("/", verifyToken, hotspotController.updateAllHotspots);

//router.get("/:roomID", hotspotController.getRoomDetail);

router.delete("/:roomID", verifyToken, hotspotController.deleteHotspot);
//router.delete("/", verifyToken, hotspotController.deleteRooms);
module.exports = router;
