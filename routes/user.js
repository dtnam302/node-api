const userController = require("../controllers/userController");
const {
  verifyToken,
  verifyTokenAndAdmin,
  verifyTokenAndUserAuthorization,
} = require("../controllers/verifyToken");

const router = require("express-promise-router")();
//GET ALL USERS
router.get("/", userController.getAllUsers);
router.get("/:userID", userController.getUserDetail);
router.get("/listfollow/:userID", userController.getListFollow);

router.put("/:userID", verifyToken, userController.updateUser);
router.put("/", verifyTokenAndAdmin, userController.updateUsers);

//DELETE USER
router.delete("/:userID", verifyTokenAndAdmin, userController.deleteUser);

//follow post

router.put("/follow/:userID", verifyToken, userController.followPost);

module.exports = router;
