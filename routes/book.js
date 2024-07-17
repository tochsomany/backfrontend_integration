const express = require("express");
const {
  getBook,
  getBooks,
  createBook,
  editBook,
} = require("../controllers/books.js");
const { validNum } = require("../middlewares/index.js");
const { cacheMiddleware } = require("../middlewares/cache.js");
/**
 * @swagger
 * tags:
 *   name: Books
 *   description: The books managing API
*/
const bookRouter = express.Router();
/**
 * @swagger
 * /books/{id}:
 *   get:
 *     tags: [Books]
 *     description: Get book by Id
 *     parameters:
 *       - in: path
 *         name: id
 *         description: The ID of the book to retrieve
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: Not Found
 */
bookRouter.get("/:id", getBook);
/**
 * @swagger
 * tags:
 *   name: Books
 *   description: The books managing API
 * /books:
 *   get:
 *     tags: [Books]
 *     description: Get all books
*      security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns all books
 */
bookRouter.get("/",cacheMiddleware, getBooks);
/**
 * @swagger
 * tags:
 *   name: Books
 *   description: The books managing API
 * /books:
 *   post:
 *     tags: [Books]
 *     description: Create a book
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       200:
 *         description: Return a created book
 *         content:
 *           application/json:
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         title:
 *           type: string
 *         author:
 *           type: string
 *         publishedDate:
 *           type: string
 *           format: date
 *         isbn:
 *           type: string
 */
bookRouter.post("/", createBook);
bookRouter.put("/:id", editBook);

module.exports = bookRouter;
