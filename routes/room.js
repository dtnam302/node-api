const roomController = require("../controllers/roomController");
const router = require("express-promise-router")();
router.get("/", roomController.getAllRoom);

module.exports = router;
