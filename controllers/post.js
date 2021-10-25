const fs = require('fs'),
  { extend } = require('lodash'),
  { IncomingForm } = require('formidable')

const Post = require('../models/post'),
  { StatusCodes } = require('../constants/status-codes')

exports.postById = (req, res, next, id) => {
  Post.findById(id, {
    body: 1,
    comments: 1,
    createdAt: 1,
    likes: 1,
    featuredImg: 1,
    postedBy: 1,
    title: 1,
    slug: 1,
  })
    .populate('postedBy', { name: 1 })
    .exec((error, post) => {
      if (error || !post) {
        return res.status(StatusCodes.NOT_FOUND).json({
          error: error ? error.message : 'Post does not exist.',
        })
      }
      req.post = post
      next()
    })
}

exports.getPostImage = (req, res) => {
  res.set('Content-Type', req.post.featuredImg.contentType)
  res.send(req.post.featuredImg.data)
}

exports.postBySlug = (req, res, next, slug) => {
  Post.findOne(
    { slug: { $eq: slug } },
    {
      body: 1,
      comments: 1,
      createdAt: 1,
      likes: 1,
      featuredImg: 1,
      postedBy: 1,
      title: 1,
      slug: 1,
    }
  )
    .populate('postedBy', { name: 1 })
    .exec((error, post) => {
      if (error || !post) {
        return res.status(StatusCodes.NOT_FOUND).json({
          error: error ? error.message : 'Post does not exist.',
        })
      }
      req.post = post
      next()
    })
}

exports.getUserPosts = (req, res) => {
  const limit = req.params.limit ? parseInt(req.params.limit) : 10,
    currentPage = req.params.pageNum ? parseInt(req.params.pageNum) : 1,
    skip = limit * (currentPage - 1)

  Post.find({ postedBy: req.profile._id })
    .populate('postedBy', { name: 1 })
    .select({ title: 1, createdAt: 1, slug: 1 })
    .sort({ createdAt: 1 })

    .exec((error, posts) => {
      if (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: error,
        })
      }
      res.status(StatusCodes.OK).json({
        currentPage,
        limit,
        totalPages: Math.ceil(posts?.length / limit),
        totalPosts: posts?.length,
        posts: posts.slice(skip, skip + limit),
      })
      // res.json(posts)
    })
}

exports.getPost = (req, res) => {
  res.json(req.post)
}

exports.getPostBySlug = (req, res) => {
  res.json(req.post)
}

exports.getPosts = (req, res) => {
  const limit = req.params.limit ? parseInt(req.params.limit) : 10,
    currentPage = req.params.pageNum ? parseInt(req.params.pageNum) : 1,
    skip = limit * (currentPage - 1)

  Post.find({}, { author: 1, createdAt: 1, title: 1, slug: 1, body: 1 })
    .populate('postedBy', { name: 1 })
    .sort({ createdAt: -1 })
    .then(posts => {
      res.status(StatusCodes.OK).json({
        currentPage,
        limit,
        totalPages: Math.ceil(posts?.length / limit),
        totalPosts: posts?.length,
        posts: posts.slice(skip, skip + limit),
      })
    })
    .catch(error =>
      res.status(StatusCodes.BAD_REQUEST).json({
        error: error,
      })
    )
}

exports.createPost = (req, res) => {
  try {
    let form = new IncomingForm({ keepExtensions: true })
    form.parse(req, (error, fields, files) => {
      if (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: error,
        })
      }

      let post = new Post(fields)

      if (req.profile) {
        req.profile.hashed_password = undefined
        req.profile.salt = undefined
        post.postedBy = req.profile
      } else {
        post.postedBy = req.user
      }

      if (files.featuredImg) {
        post.featuredImg.data = fs.readFileSync(files.featuredImg.path)
        post.featuredImg.contentType = files.featuredImg.type
      }

      post.save((err, result) => {
        if (err) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            error: err,
          })
        }
        res.json(result)
      })
    })
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: error,
    })
  }
}

exports.updatePost = (req, res, next) => {
  try {
    let form = new IncomingForm({ keepExtensions: true })
    form.parse(req, (error, fields, files) => {
      if (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: error,
        })
      }
      // save post
      let post = req.post
      post = extend(post, fields)
      post.updatedAt = Date.now()

      if (files.featuredImg) {
        post.featuredImg.data = fs.readFileSync(files.featuredImg.path)
        post.featuredImg.contentType = files.featuredImg.type
      }

      post.save((err, result) => {
        if (err) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            error: err,
          })
        }
        res.json(result)
      })
    })
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: error,
    })
  }
}

exports.isPoster = (req, res, next) => {
  // let sameUser = req.post && req.user && req.post.postedBy._id == req.user._id
  // let adminUser = req.post && req.user && req.user.role === 'admin'

  // let isPoster = sameUser || adminUser
  let isPoster = req.post && req.user && req.post.postedBy.id === req.user.id

  if (!isPoster) {
    return res.status(403).json({
      error: 'User is not authorized',
    })
  }
  next()
}

exports.deletePost = (req, res) => {
  let post = req.post
  post.remove(err => {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: err,
      })
    }
    res.json({
      message: 'Post deleted successfully',
    })
  })
}
