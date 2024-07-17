const mongoose = require("mongoose");

const tweetSchema = new mongoose.Schema({
  text: { type: String },
  byUser: { type: mongoose.Types.ObjectId, ref: "User" },
});

const Tweet = mongoose.model("Tweet", tweetSchema);
module.exports = Tweet;
