const express = require("express");
const {
  createTweet,
  getTweet,
  getTweets,
  deleteTweetById,
  getTweetById,
  getTweetByUserId,
} = require("../controllers/tweet.js");

const { resourceControl, authroize } = require("../middlewares/index.js");


const tweetRouter = express.Router();

tweetRouter.post("/", createTweet);
tweetRouter.delete(
  "/:id",
  authroize("delete_own_record"),
  resourceControl("tweets"),
  deleteTweetById
);

tweetRouter.get("/:id", getTweetById);
tweetRouter.get("/user/:byUser", getTweetByUserId);
tweetRouter.get("/", getTweets);

module.exports = tweetRouter;
