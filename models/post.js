const db = require('mongoose'),
  slug = require('mongoose-slug-generator'),
  { ObjectId } = db.Schema

db.plugin(slug)

const postSchema = new db.Schema({
  title: {
    type: String,
    required: 'Title is required',
    minLength: 5,
    maxLength: 150,
  },
  slug: { type: String, slug: 'title', unique: true },
  body: {
    type: String,
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
