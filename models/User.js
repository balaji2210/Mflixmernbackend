const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required Field"],
    },
    email: {
      type: String,
      unique: true,
      require: [true, "Email is required Field"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    role: {
      type: String,
      default: "user",
    },
  },
  { timeseries: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.validatePassword = async function (usersendpassword) {
  return bcrypt.compare(usersendpassword, this.password);
};

userSchema.methods.getJwt = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET);
};

module.exports = mongoose.model("User", userSchema);
