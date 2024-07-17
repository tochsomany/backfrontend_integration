const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: { type: String,require: true },
  page: { type: Number, require: true },
  genre: {require: true,type: String},
  byAuthors: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  ],},{timestamps: true});

const Book = mongoose.model("Book", bookSchema);
module.exports = Book;
