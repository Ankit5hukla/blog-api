require('dotenv').config()
const chalk = require('chalk')
const cors = require('cors')
const path = require('path')
const express = require('express')
const expressValidator = require('express-validator')
const morgan = require('morgan')
const db = require('mongoose')
const apiRoute = require('./routes')
const app = express()

const port = process.env.PORT || 7000

// db
db.connect(process.env.MONGO_URI)
db.connection.on('connected', a1 =>
  console.log(chalk.cyan(`DB connected ${chalk.bgGreen.white('successfully')}`))
)

db.connection.on('error', err => console.error(chalk.red(err.message)))

app.use([
  morgan('dev'),
  // express.urlencoded({ extended: true }),
  express.json(),
  expressValidator(),
  cors(),
])

app.use('/', apiRoute)

app.get('/favicon.ico', (req, res) => {
  res.status(404).end()
})

app.listen(port, () => {
  console.log(chalk.magenta(`Listening on port: ${chalk.bgWhite(port)} `))
})
