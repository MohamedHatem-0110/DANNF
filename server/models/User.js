const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  verificationCode: {
    type: String,
  },
  mobileNumber: {
    type: String,
  },
  fullName: {
    type: String,
  },
  nationalID: {
    type: Number,
  },
  motorcycleNumber: {
    type: Number,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
