const userController = require("../controllers/userController");
const {
  verifyToken,
  verifyTokenAndAdmin,
  verifyTokenAndUserAuthorization,
} = require("../controllers/verifyToken");

const router = require("express-promise-router")();
//GET ALL USERS
router.put(
  "/:userID",
  verifyTokenAndUserAuthorization,
  userController.updateUser
);

//DELETE USER
router.delete("/:userID", verifyTokenAndAdmin, userController.deleteUser);

module.exports = router;
