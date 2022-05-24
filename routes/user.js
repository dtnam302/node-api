const userController = require("../controllers/userController");
const {
  verifyToken,
  verifyTokenAndAdmin,
  verifyTokenAndUserAuthorization,
} = require("../controllers/verifyToken");

const router = require("express-promise-router")();
//GET ALL USERS
router.get("/", verifyTokenAndAdmin, userController.getAllUsers);
router.get("/:userID", verifyToken, userController.getUserDetail);
router.get("/listfollow/:userID", verifyToken, userController.getListFollow);

router.put("/:userID", verifyToken, userController.updateUser);

//DELETE USER
router.delete("/:userID", verifyTokenAndAdmin, userController.deleteUser);

//follow post

router.put("/follow/:userID", verifyToken, userController.followPost);

module.exports = router;
