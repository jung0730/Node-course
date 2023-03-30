const successHandler = require('../service/successHandler');
const errorHandler = require('../service/errorHandler');
const Post = require('../models/posts');
const posts = {
  async getPosts(req, res) {
    const postsData = await Post.find();
    successHandler(res, postsData);
  },
  async createPosts(req, res) {
    try {
      const data = req.body;
      if (data.content && data.name) {
        const newPost = await Post.create({
          name: data.name,
          content: data.content,
          image: data.image,
          likes: data.likes
        });
        successHandler(res, newPost);
      } else {
        errorHandler(res, '資料未填寫完成');
      }
    } catch (err) {
      errorHandler(res, err);
    }
  },
  async patchPost(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;
      if (!data.content || !data.name) {
        errorHandler(res, '資料未填寫完成');
      } else {
        const editPost = {
          name: data.name,
          content: data.content,
          image: data.image,
          likes: data.likes
        }
        const thePost = await Post.findByIdAndUpdate(id, editPost, { new: true });
        if (thePost) {
          successHandler(res, thePost);
        } else {
          errorHandler(res, 'id 不存在');
        }
      }
    } catch (err) {
      errorHandler(res, err);
    }
  },
  deletePost(req, res) {
    
  },
  deletePosts(req, res) {

  }
}

module.exports = posts;