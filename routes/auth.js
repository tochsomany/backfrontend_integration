const express = require("express");
const { longinUser, showGoogleAuth, googleCallback } = require("../controllers/auth");
const { loginSchema,signupSchema } = require("../common/validate");
const { handleValidate } = require("../middlewares/index");

/**
 * @swagger
 * tags:
 *  name: Auth
 *  description: Auth Route
 */
const authRouter = express.Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     description: User login
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *             type: object
 *             properties:
 *               email:
 *                  type: string
 *                  example: sok3@gmail.com
 *               password:
 *                  type: string
 *                  example: 1234567
 *     responses:
 *       200:
 *         description: Return a created book
 */
authRouter.post("/login", loginSchema, handleValidate, longinUser);
authRouter.post("/signup",signupSchema,handleValidate , signupUser);

//google authentication
authRouter.get("/show-google-auth",showGoogleAuth);
authRouter.get("/google-callback",googleCallback);

module.exports = authRouter;
