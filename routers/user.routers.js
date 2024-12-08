const router = require('express').Router();
const UserController = require("../controller/user.controller");

router.post('/registeration',UserController.register);
router.post('/login',UserController.login);
router.post('/update-profile-picture', UserController.updateProfilePicture);
router.get("/profile-picture", UserController.getProfilePicture);

module.exports = router;

