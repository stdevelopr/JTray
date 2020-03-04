const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: false
  },
  admin: {
    type: Boolean,
    required: true
  }
});

module.exports = mongoose.model("Users", UserSchema);
