const mongoose = require("mongoose");

const { Schema } = mongoose;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  created: {
    type: Date,
    default: Date.now
  },
  verified: {
    type: Boolean,
    default: false
  },
  username: {
    type: String,
    required: true
  },
  usernameL: {
    type: String
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  resetToken: {
    type: String
  },
  resetTime: {
    type: Date,
    default: Date.now
  },
  knownLocations: {
    type: Array
  }
});

const User = mongoose.model("users", UserSchema);

module.exports = User;
