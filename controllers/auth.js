var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const User = require("../models/user");
const axios = require("axios");
const { signJWT } = require("../utils");

longinUser = async (req, res) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!",
      });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      algorithm: "HS256",
      expiresIn: "24h", // 24 hours
    });

    console.log(token);

    res.status(200).send({
      id: user._id,
      name: user.name,
      email: user.email,
      accessToken: token,
      role: user.role
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
signupUser = async (req, res) => {
  try {
    // Create a new user instance
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10),
      role: req.body.role
    });

    // Save the user to the database
    await user.save();

    res.send({ message: "User was registered successfully!" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

showGoogleAuth = async (req, res) => {
  const uri = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIEND_ID}&redirect_uri=${process.env.GOOGLE_CALLBACK}&response_type=code&scope=profile email openid`;
  return res.redirect(uri);
};

googleCallback = async (req, res) => {
  const code = req.query.code;
  // console.log(code)
  // return res.json(code)
  const url = "https://oauth2.googleapis.com/token";
  const { data } = await axios.post(url, {
    client_id: process.env.GOOGLE_CLIEND_ID,
    client_secret: process.env.GOOGLE_CLIEND_SECRET,
    code: code,
    redirect_uri: process.env.GOOGLE_CALLBACK,
    grant_type: "authorization_code",
  });
  const access_token = data.access_token;
  const google_get_data = "https://www.googleapis.com/oauth2/v1/userinfo";
  const response = await axios.get(google_get_data, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  const userprofile = response.data;
  const user = await User.findOne({ email: userprofile.email });
  if (!user) {
    // Register new user
    const newUser = new User({
      name: userprofile.name,
      email: userprofile.email,
      userType: "sso",
      username: userprofile.given_name + "-" + Date.now(),
    });
    const result = await newUser.save();
    const token = signJWT(result._id, result.email);
    return res.json(token);
  }
  // 4 - Sign user with our own JWT
  const token = signJWT(user._id, user.email);
  return res.json(token);
};

module.exports = { longinUser, signupUser, showGoogleAuth, googleCallback };
