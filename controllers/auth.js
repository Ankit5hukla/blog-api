require('dotenv').config()
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const { StatusCodes } = require('../constants/status-codes')

exports.checkUserName = async (req, res) => {
  const userNameExists = await User.findOne({
    username: req.body.username,
  })

  if (userNameExists)
    return res.status(StatusCodes.FORBIDDEN).json({
      error: 'Username already taken.',
    })
  res.status(StatusCodes.OK).json({
    message: 'Username available for Sign Up.',
  })
}

exports.checkEmail = async (req, res) => {
  const userEmailExists = await User.findOne({
    email: req.body.email,
  })

  if (userEmailExists)
    return res.status(StatusCodes.FORBIDDEN).json({
      error: 'Email already taken.',
    })
  res.status(StatusCodes.OK).json({
    message: 'Email available for Sign Up.',
  })
}

exports.signUp = async (req, res) => {
  const userExists = await User.findOne({
    $or: [
      {
        username: req.body.username,
      },
      {
        email: req.body.email,
      },
    ],
  })
  if (userExists)
    return res.status(StatusCodes.FORBIDDEN).json({
      error: 'Username or Email already taken.',
    })
  const user = await new User(req.body)
  await user.save()
  res
    .status(StatusCodes.OK)
    .json({ message: 'Sign Up Completed! Proceed with login' })
}

exports.signIn = async (req, res) => {
  // find the user based on the email or username
  const { userID, email, password } = req.body,
    emailRe =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  let user
  if (emailRe.test(userID)) {
    user = await User.findOne({ email: userID })
  } else {
    user = await User.findOne({ username: userID })
  }
  try {
    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        error: `User doesn't exist with the given username or email`,
      })
    }
    // user authenticate
    if (!user.authenticate(password)) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        error: `Username and Password mismatch.`,
      })
    }
    const accessToken = jwt.sign(
        { _id: user._id },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: '30m',
        }
      ),
      refreshToken = jwt.sign(
        { _id: user._id },
        process.env.REFRESH_TOKEN_SECRET
      )
    res.status(StatusCodes.OK).json({ accessToken, refreshToken, user })
  } catch (error) {
    console.error(error)
    if (error || !user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        error: `User doesn't exist with the given username`,
      })
    }
  }
}

exports.requireSignIn = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization
    if (!authorization) {
      throw new Error('Authorization missing in the request')
    }
    const accessToken = authorization.split(' ').pop()
    jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET,
      (error, payload) => {
        if (error) {
          // TokenExpiredError
          return res.status(StatusCodes.GATEWAY_TIMEOUT).json({
            error:
              error.name === 'TokenExpiredError'
                ? 'Authorization token expired'
                : error.message,
          })
        }
        User.findById(
          payload._id,
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
            req.userId = payload._id
            req.user = user
            next()
          }
        )
      }
    )
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      error: error.message,
    })
  }
}
