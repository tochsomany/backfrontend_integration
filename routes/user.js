const express = require("express");
const {getUser, getUsers, deleteUserById, createUser, updateUser} = require("../controllers/user.js")
const { validNum,authroize } = require("../middlewares/index.js")
const passport = require('passport');


const userRouter = express.Router()

userRouter.get('/:id', getUser)

userRouter.delete('/:id',passport.authenticate('jwt', { session: false }),authroize('delete_record'),deleteUserById)

//passport authentication 
userRouter.get('/',passport.authenticate('jwt', { session: false }), getUsers)


userRouter.post('/', createUser)
userRouter.post('/:id', updateUser)
userRouter.get('/:id/tweets', getUser)

module.exports = userRouter
