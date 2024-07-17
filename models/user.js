const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { required:true, type: String},
  age: Number,
  email: { type: String, unique: true},
  tweets: [{type: mongoose.Types.ObjectId, ref:'Tweet'}],
  username: {type: String},
  password: {type: String},
  userType: {
    type: String,
    enum: ["sso", "normal"],
    default: 'normal'
  },
  role: {
    type: String,
    enum: ["user", "editor", "admin"],
    default: 'user'
  },
  facebookUrl: {tyep: String},
});

const User = mongoose.model("User", userSchema);
module.exports = User;
