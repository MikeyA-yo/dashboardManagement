const router = require("express").Router();
const { registerUser, logIn, deleteAllUsers, logOut, checkUser } = require("../controllers/users");
const authMiddleware = require("../middleware/auth");

router.post("/register", registerUser);
router.post("/login", logIn); 
router.post("/logout", logOut)
router.post("/check", checkUser)
// router.delete("/deleteAll", authMiddleware, deleteAllUsers);
router.delete("/deleteAll", deleteAllUsers);

module.exports = router;
