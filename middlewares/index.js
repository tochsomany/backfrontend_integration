const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

const { getPermissionsByRoleName } = require("../roles/roles");
const User = require("../models/user");
const Tweet = require("../models/tweet");
const { rateLimit } = require('express-rate-limit')
const { RedisStore } = require('rate-limit-redis')
const redis = require('redis')
const client = redis.createClient({
    url: `redis://${process.env.REDIS_HOST}:6379`
})

client.on('error', (err) => {
    console.error('Redis error:', err)
}).on('connect', () => console.log('Conneted to Redis server!')).connect()

// Example middleware function

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  limit: (req, res) => {
      if (validateToken(req)) {
          // 30 requests per minute for logged in user
          return 30
      } else {
          // 10 requests per minute for normal user
          return 10
      }
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  store: new RedisStore({
		sendCommand: (...args) => client.sendCommand(args),
	}),
})

const handleValidate = (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(401).json({ errors: result.array() });
  }
  next();
};

const loginLimit = rateLimit(
  {
      windowMs: 60 * 60 * 1000, // 60 minute
      limit: 5,
      standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
      legacyHeaders: false, // Disable the `X-RateLimit-*` headers}
  }
)

const validateToken = (req) => {
  // Extract token from request header from clinet
  let token = req.header("Authorization")
  if (!token) {
      return false
  }
  token = token.replace("Bearer ", "")
  const decoded = jwt.verify(token, process.env.JWT_SECRET)
  if (decoded) {
      return true
  } else {
      return false
  }
}

const verifyToken = async (req, res, next) => {
  let token = req.header("Authorization");

  if (!token) {
    return res.status(403).json({ message: "No token provided!" });
  }
  token = token.replace("Bearer ", "");

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log(decoded);
  const user = await User.findById(decoded.id);

  req.user = user;
  next();
};

const authroize = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.sendStatus(401); // Unauthorized
    }
    const userRole = req.user ? req.user.role : 'anonymous'
    const permissions = getPermissionsByRoleName(userRole);
    if (permissions.includes(permission)) {
      req.permission = permission;
      next();
    } else {
      return res.status(403).json({ error: "Access denied" });
    }
  };
};

const resourceControl = (resource) => {
  return async (req, res, next) => {
    const deletedId = req.params.id;
    const userId = req.user.id;
    if (req.user.role == "admin") {
      return next();
    }
    if (
      req.permission == "delete_own_record" ||
      req.permission == "update_own_record"
    ) {
      if (resource == "tweets") {
        const tweet = await Tweet.findOne({ _id: deletedId, byUser: userId })
        console.log(tweet)
        if (!tweet) {
          return res.status(403).json({ error: "Forbidden" })
        } 
        next();
    }
    }
  };
};

const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next(); // Call the next middleware function
};

const errorHandle = (err, req, res, next) => {
  //console.error("Error server: ", err.stack)
  return res.status(500).send(err.message);
};

// check error if num ber or not

const validNum = (req, res, next) => {
  const id = req.params.id;
  if (!isNaN(id)) {
    next();
  }
  throw Error(`id: ${id} contain string`);
};

module.exports = {
  logger,
  errorHandle,
  validNum,
  verifyToken,
  handleValidate,
  authroize,
  resourceControl,
  loginLimit,
  validateToken,
  limiter
};
