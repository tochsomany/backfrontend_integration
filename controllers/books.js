const Book = require("../models/book");
const redis = require("redis");
const client = redis.createClient({
  url: `redis://${process.env.REDIS_HOST}:6379`,
});
const asyncHandler = require("express-async-handler");

client
  .on("error", (err) => {
    console.error("Redis error:", err);
  })
  .on("connect", () => console.log("Conneted to Redis server!"))
  .connect();

const getBook = async (req, res) => {
  const id = req.params.id;
  const result = await Book.findById({ _id: id });

  if (!result) {
    return res.json({ book: "Book Not Found" });
  }
  return res.json(result);
};

const getBooks = asyncHandler(async (req, res) => {
  const books = await Book.find({});
  console.log(books)
  return res.json(books);
});

// const getBooks = async (req, res) => {
//   const books = await Book.find();
//   const { baseUrl } = req
//   const data = await client.get(baseUrl)
//   if (data == null) {
//       // Save to cache server
//       client.set(baseUrl, JSON.stringify(books), {
//           EX: 60
//       })
//   }
//   return res.json(books);
// };

const createBook = asyncHandler(async (req, res) => {
  const { title, author, page } = req.body;
  const book = new Book({
    title: title,
    author: author,
    page: page,
  });
  const result = await book.save();
  const { baseUrl } = req;
  await client.del(baseUrl);
  return res.json(result);
});

const editBook = asyncHandler(async (req, res, next) => {
  const { id } = req.params; // Assuming id is passed as a route parameter
  const { title, author, page } = req.body;
  if (!title && !author && !page)
    return res.status(400).json({
      error: "At least one field (title, author, page) is required for update.",
    });

  const updatedBook = await Book.findByIdAndUpdate(id, {
    title,
    author,
    page,
  });
  const baseUrl = "/books";

  await client.del(baseUrl);
  return res.json(updatedBook);
});

module.exports = { getBook, getBooks, createBook, editBook };
