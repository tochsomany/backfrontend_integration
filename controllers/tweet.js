const Tweet = require("../models/tweet");
const User = require("../models/user");
const asyncHandler = require("express-async-handler");

const createTweet = async (req, res, next) => {
  const { text, byUser } = req.body;
  try {
    const tweet = new Tweet({
      text: text,
      byUser: byUser,
    });
    const result = await tweet.save();
    const user = await User.findById(byUser);
    user.tweets.push(result._id);
    await user.save();
    return res.json(result);
  } catch (err) {
    next(Error(err.errmsg));
  }
};
//use asyncHandler for catch Err add

const getTweets = asyncHandler(async (req, res) => {
  const tweets = await Tweet.find();
  return res.json(tweets);
});

//findOne
const getTweetByUserId = asyncHandler(async (req, res) => {
  const id = req.params.id;

  const result = await Tweet.findOne({ byUser: id });
  return res.json(result);
});

const getTweetById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const tweet = await Tweet.findById(id);
  return res.json({ tweet });
});
const deleteTweetById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const result = await Tweet.deleteOne({ _id: id });
  return res.json(result);
});

// //findById
// const getTweet = async (req, res) => {
//   const id = req.params.id;
//   const result = await Tweet.findById({ _id: id });

//   if (!result) {
//     return res.json({ tweet: "Tweet Not Found" });
//   }
//   return res.json(result);
// };

module.exports = {
  createTweet,
  getTweetByUserId,
  getTweets,
  getTweetById,
  deleteTweetById,
};
