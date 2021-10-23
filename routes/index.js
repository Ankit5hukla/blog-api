const express = require('express')
const apiDocs = require('../docs/api.json')
const { StatusCodes } = require('../constants/status-codes')

const apiRoute = express.Router()
const authRoute = require('./auth')
const postRoute = require('./post')
const userRoute = require('./user')

apiRoute.use('/auth', authRoute)
apiRoute.use('/post', postRoute)
apiRoute.use('/user', userRoute)

apiRoute.use('/', (req, res) => {
  res
    .status(StatusCodes.OK)
    .json({ message: 'Ping Successful API Server Running...', apis: apiDocs })
})

module.exports = apiRoute
