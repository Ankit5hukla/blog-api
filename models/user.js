const chalk = require('chalk')
const { isEqual } = require('lodash')
const db = require('mongoose')
const crypto = require('crypto')
const { v1: uuidV1 } = require('uuid')

const userSchema = new db.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  username: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    required: true,
  },
  hashed_password: {
    type: String,
    required: true,
  },
  salt: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
})

// virtual Fields
userSchema
  .virtual('password')
  .set(function (password) {
    // create temporary variable for _password
    this._password = password
    // generate a timestamp
    this.salt = uuidV1()
    // encrypt the password
    this.hashed_password = this.encryptPassword(password)
  })
  .get(function () {
    return this._password
  })

// methods
userSchema.methods = {
  authenticate: function (plainText) {
    return isEqual(this.encryptPassword(plainText), this.hashed_password)
  },
  encryptPassword: function (password) {
    if (!password) {
      return ''
    }
    try {
      return crypto.createHmac('sha1', this.salt).update(password).digest('hex')
    } catch (error) {
      console.error(chalk.bgRed.white(error.message))
    }
  },
}

module.exports = db.model('User', userSchema)
