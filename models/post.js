const db = require('mongoose')
const { ObjectId } = db.Schema

const postSchema = new db.Schema({
  title: {
    type: String,
    required: 'Title is required',
    minLength: 5,
    maxLength: 150,
  },
  body: {
    type: String,
    required: 'Body is required',
    minLength: 5,
    maxLength: 2000,
  },
  featuredImg: {
    data: Buffer,
    contentType: String,
  },
  postedBy: {
    type: ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
})

module.exports = db.model('Post', postSchema)
