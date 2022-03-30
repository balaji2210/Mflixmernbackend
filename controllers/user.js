const User = require("../models/User");

const Bigpromise = require("../middlewares/Bigpromise");

const { cookieToken } = require("../utils/cookieToken");

exports.signup = Bigpromise(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  const existingUSer = await User.findOne({ email });

  if (existingUSer) {
    return res.status(400).json({
      success: false,
      message: "User Email Already Exits",
    });
  } else {
    const user = await User.create(req.body);
    cookieToken(user, res);
  }
});

exports.signin = Bigpromise(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and Password is required",
    });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({
      message: "User does not exist with email",
    });
  }

  const isValid = await user.validatePassword(password);

  if (!isValid) {
    return res.status(400).json({
      message: "Email or password is wrong",
    });
  }

  cookieToken(user, res);
});

exports.logout = Bigpromise(async (req, res, next) => {
  res.cookie("token", null);
  req.user = null;
  return res.status(200).json({
    success: true,
    message: "Logout success",
  });
});
