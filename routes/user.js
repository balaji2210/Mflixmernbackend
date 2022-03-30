const express = require("express");

const router = express.Router();

const { signup, signin, logout } = require("../controllers/user");

router.route("/signup").post(signup);
router.route("/signin").post(signin);
router.route("/logout").get(logout);

module.exports = router;
