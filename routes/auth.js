const express = require('express')
const {
  checkEmail,
  checkUserName,
  signIn,
  signUp,
} = require('../controllers/auth')
const { StatusCodes } = require('../constants/status-codes')
const {
  userSignUpValidator,
  userSignInValidator,
  emailValidation,
  userNameValidation,
} = require('../validators')

const authRoute = express.Router()

authRoute.post('/username-availability', userNameValidation, checkUserName)
authRoute.post('/email-availability', emailValidation, checkEmail)
authRoute.post('/sign-up', userSignUpValidator, signUp)

authRoute.post('/sign-in', userSignInValidator, signIn)

authRoute.use('/', (_, res) => {
  res
    .status(StatusCodes.BAD_REQUEST)
    .json({ message: 'API Error: invalid end point' })
})

module.exports = authRoute
