const Bigpromise = require("./Bigpromise");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.isLoggedIn = Bigpromise(async (req, res, next) => {
  const token =
    req.cookies.token || req.header("Authorization").replace("Bearer ", " ");

  if (!token) {
    return res.status(400).json({
      message: "Access Denied",
    });
  }
  const decoed = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await User.findById(decoed.id).select("-password");
  next();
});

exports.customRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(402).json({
        message: "You are not allowed",
      });
    }
    next();
  };
};
