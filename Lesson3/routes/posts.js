const express = require('express');
const router = express.Router();
const { getPosts, createPosts, patchPost, deletePosts, deletePost } = require('../controllers/posts');
router.get('/', getPosts);
router.post('/', createPosts);
router.patch('/:id', patchPost);
router.delete('/', deletePosts);
router.delete('/:id', deletePost);
module.exports = router;