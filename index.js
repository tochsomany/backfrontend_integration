// index.js
require("dotenv").config(); //Must be alway top both

const passport = require("passport");
const jwtStrategy = require("./common/strategies/jwt-strategy.js");

const https = require("https");
const fs = require("fs");
const express = require("express");
const parser = require("body-parser");
const dbConnect = require("./db/db.js");

const key = fs.readFileSync("localhost-key.pem", "utf-8");
const cert = fs.readFileSync("localhost.pem", "utf-8");
const {
  errorHandle,
  logger,
  verifyToken,
  validateToken,
  limiter,
} = require("./middlewares/index.js");

const userRoute = require("./routes/user.js");
const bookRouter = require("./routes/book.js");

const app = express();

const tweetRouter = require("./routes/tweet.js");
const authRouter = require("./routes/auth.js");

const uploadRouter = require("./routes/upload.js");
const fileRouter = require("./routes/file.js");
const { cacheInterceptor } = require("./interceptors/index.js");
const { cacheMiddleware } = require("./middlewares/cache.js");
const { setupSwagger } = require("./swagger/index.js");
const { bookSchema } = require("./common/validate/index.js");

dbConnect();

app.use(logger);
setupSwagger(app);

app.use(limiter);

passport.use(jwtStrategy);

app.use(parser.json());
app.get("/", (req, res) => {
  res.send(users);
});

app.use("/auth", authRouter);

app.use(cacheInterceptor(60));
app.use(cacheMiddleware);

app.use("/uploads", uploadRouter);

app.use("/files", fileRouter);

app.use("/users", userRoute);
app.use("/books",bookSchema,
  //  passport.authenticate("jwt", { session: false }), 
   bookRouter);
// app.use("/tweets",passport.authenticate('jwt', { session: false }), tweetRouter);
app.use("/tweets", tweetRouter);
app.use(errorHandle);

// server = https.createServer({ key, cert }, app);
// server.listen(3000);

app.listen(3000, () => {
  console.log("Listening on port 3000!");
});
