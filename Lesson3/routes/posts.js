const express = require('express');
const router = express.Router();
const Post = require("../models/postModels");

router.get('/', async function(req, res, next) {
  const posts = await Post.find();
  res.status(200).json({
    data: posts
  })
});

router.post('/', async function(req, res, next) {
  const newPost = await Post.create({
    name: req.body.name,
    content: req.body.content
  });
  res.status(200).json({
    data: newPost
  })
});

module.exports = router;