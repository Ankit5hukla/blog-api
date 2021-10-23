const User = require('../models/user')
const { extend } = require('lodash')
const { StatusCodes } = require('../constants/status-codes')

exports.userById = (req, res, next, userId) => {
  User.findById(
    userId,
    {
      name: 1,
      username: 1,
      email: 1,
      createdAt: 1,
      updatedAt: 1,
    },
    (err, user) => {
      if (err || !user) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: 'User not found',
        })
      }
      req.profile = user
      next()
    }
  )
}

exports.getUser = (req, res) => {
  res.json(req.profile)
}

exports.getUsers = (req, res) => {
  User.find({}, { name: 1, username: 1, email: 1, createdAt: 1, updatedAt: 1 })
    .then(users =>
      res.status(StatusCodes.OK).json({
        users,
      })
    )
    .catch(error =>
      res.status(StatusCodes.BAD_REQUEST).json({
        error: error.message,
      })
    )
}

exports.updateUser = (req, res) => {
  let user = req.profile
  user = extend(user, req.body) // extend - mutate the source object
  user.updatedAt = Date.now()
  user.save(err => {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: 'You are not authorized to perform this action',
      })
    }
    user.hashed_password = undefined
    user.salt = undefined
    res.json({ user })
  })
}

exports.deleteUser = (req, res) => {
  let user = req.profile
  user.remove((err, user) => {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: err,
      })
    }
    res.json({ message: 'User deleted successfully' })
  })
}
