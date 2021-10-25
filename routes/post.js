const express = require('express')

const { userById } = require('../controllers/user'),
  {
    createPost,
    deletePost,
    getPost,
    getPostBySlug,
    getPosts,
    getUserPosts,
    isPoster,
    postById,
    postBySlug,
    updatePost,
  } = require('../controllers/post'),
  { requireSignIn } = require('../controllers/auth'),
  { createPostValidator } = require('../validators')

const postRoute = express.Router()
// Create Post Route
postRoute.post(
  '/create/:userId?',
  requireSignIn,
  createPost,
  createPostValidator
)
// Get user Posts by userId
postRoute.get('/user/:userId/:pageNum?/:limit?', requireSignIn, getUserPosts)
// Get Post by postId
postRoute.get('/id/:postId', getPost)
// update Post by postId
postRoute.put('/id/:postId', requireSignIn, isPoster, updatePost)
// Delete Post by postId
postRoute.delete('/id/:postId', requireSignIn, isPoster, deletePost)
// Get Post by slug
postRoute.get('/slug/:slug', getPostBySlug)
// Get All Posts
postRoute.get('/:pageNum?/:limit?', getPosts)

// imp: Get Post when postId param is present in the request
postRoute.param('slug', postBySlug)
// imp: Get Post when postId param is present in the request
postRoute.param('postId', postById)
// imp: Get User when userId param is present in the request
postRoute.param('userId', userById)

module.exports = postRoute
