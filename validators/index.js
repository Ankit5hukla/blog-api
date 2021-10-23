const { StatusCodes } = require('../constants/status-codes')
const { check, oneOf, validationResult } = require('express-validator/check')

exports.createPostValidator = (req, res, next) => {
  // title
  req.check('title', 'Write a title').notEmpty()
  req.check('title', 'Title must be between 5 to 150 characters').isLength({
    min: 5,
    max: 150,
  })
  // body
  req.check('body', 'Write a title').notEmpty()
  req.check('body', 'Title must be between 5 to 2000 characters').isLength({
    min: 5,
    max: 2000,
  })
  // check errors
  const errors = req.validationErrors()
  // response if there is an error
  if (errors) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: errors.map(error => error.msg)[0] })
  }
  // proceed to next step
  next()
}

exports.userSignUpValidator = (req, res, next) => {
  // name
  req.check('name', 'Name is required').notEmpty()

  // username
  req
    .check('username')
    .notEmpty()
    .withMessage('Username is required')
    .isLength({
      min: 8,
      max: 20,
    })
    .withMessage('Username must be between 8 to 20 characters')

  // email
  req
    .check('email', 'Email is required')
    .notEmpty()
    .matches(/.+\@.+\..+/)
    .withMessage('Email must contain @')
    .isLength({
      min: 5,
      max: 32,
    })
    .withMessage('Email must be between 3 to 32 characters')

  // password
  req.check('password', 'Password is required').notEmpty()
  req
    .check('password')
    .isLength({
      min: 8,
    })
    .withMessage('Password must contain at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
    .withMessage(
      `Passsword must contains at least <br/>one uppercase, one lowercase, <br/>one special characters and one number.`
    )

  // check errors
  const errors = req.validationErrors()

  // response if there is an error
  if (errors) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: errors.map(error => error.msg)[0] })
  }

  // proceed to next step
  next()
}

exports.userNameValidation = (req, res, next) => {
  // username or email
  check('username').exists()

  try {
    validationResult(req).throw()
    // proceed to next step
    next()
  } catch (err) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: errors.map(error => error.msg)[0] })
  }
}

exports.emailValidation = (req, res, next) => {
  // username or email
  check('email').exists()

  try {
    validationResult(req).throw()
    // proceed to next step
    next()
  } catch (err) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: errors.map(error => error.msg)[0] })
  }
}

exports.userSignInValidator = (req, res, next) => {
  if (req.body.username) {
    // username
    req
      .check('username')
      .notEmpty()
      .withMessage('Username is required')
      .isLength({
        min: 5,
        max: 20,
      })
      .withMessage('Username must be between 5 to 20 characters')
  }

  if (req.body.email) {
    // email
    req
      .check('email')
      .notEmpty()
      .withMessage('Email is required')
      .matches(/.+\@.+\..+/)
      .withMessage('Email must contain @')
  }
  // password
  req.check('password', 'Password is required').notEmpty()
  req
    .check('password')
    .isLength({
      min: 8,
    })
    .withMessage('Password must contain at least 8 characters')

  // check errors
  const errors = req.validationErrors()

  // response if there is an error
  if (errors) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: errors.map(error => error.msg)[0] })
  }

  // proceed to next step
  next()
}
