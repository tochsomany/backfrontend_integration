const { setRandomFallback } = require("bcryptjs");
const Tweet = require("../models/tweet");
const User = require("../models/user");


const getUser = async (req, res) => {
  const id = req.params.id;

  const result = await User.findById({ _id: id });
  return res.json(result);
};
const getTweetByUserId = async (req, res) => {
  const id = req.params.id;
  const result = await Tweet.find({byUser: id});
  return res.json(result);
};

const getUsers = async (req, res) => {
  const users = await User.find();
  return res.json(users);
};
const deleteUserById = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await User.deleteOne({ _id: id });
    return res.json(result);
  } catch (err) {
    next(Error(err.errmsg));
  }
};

const createUser = async (req, res, next) => {
  const { name, age, email,username,facebookUrl } = req.body;
  try {
    const user = new User({
      name: name,
      age: age,
      email: email,
      username: username,
      facebookUrl: facebookUrl
    });
    const result = await user.save();
    return res.json(result);
  } catch (err) {
    next(Error(err.errmsg));
  }
};

const updateUser = async (req, res, next) => {
  const id = req.params.id
  //get all data from req.body than put everything to self except password and confirmpasswrod  
  const {password, confirmpassword, ...self} = req.body
  const result = await User.updateOne({...self,id})
  const user = await User.findById(id)
  return res.json({result, user})
};


module.exports = { getUser, getUsers, deleteUserById, createUser, updateUser };
