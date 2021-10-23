const express = require('express')

const {
  getUser,
  getUsers,
  updateUser,
  deleteUser,
  userById,
} = require('../controllers/user')
const { requireSignIn } = require('../controllers/auth')

const userRoute = express.Router()

userRoute.get('/:userId', requireSignIn, getUser)

userRoute.put('/:userId', requireSignIn, updateUser)

userRoute.delete('/:userId', requireSignIn, deleteUser)

userRoute.get('/', getUsers)

userRoute.param('userId', userById)

module.exports = userRoute
