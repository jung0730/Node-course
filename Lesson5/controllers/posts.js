const successHandler = require('../service/successHandler');
const errorHandler = require('../service/errorHandler');
const Post = require('../models/posts');
const User = require('../models/users');
const posts = {
  async getPosts(req, res) {
    // const postsData = await Post.find().populate({
    //   path: "user",
    //   select: "name photo" // 顯示user 裡的特定欄位
    // });
    const timeSort = req.query.timeSort == "asc" ? "createdAt" : "-createdAt";
    const q = req.query.q !== undefined ? { "content": new RegExp(req.query.q) } : {};
    const postsData = await Post.find(q).populate({
      path: 'user',
      select: 'name photo'
    }).sort(timeSort);
    successHandler(res, postsData);
  },
  createPosts(req, res) {
    if (req.body.content == undefined){
      return next(appError(400,"你沒有填寫 content 資料"))
    }
    const newPost = await Post.create({
      name: data.name,
      content: data.content,
      image: data.image,
      likes: data.likes
    });
    res.status(200).json({
      status:"success",
      post: newPost
    })
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
  async deletePost(req, res) {
    try {
      const { id } = req.params;
      const thePost = await Post.findByIdAndDelete(id);
      if (thePost) {
        successHandler(res, thePost);
      } else {
        errorHandler(res, 'id 不存在');
      }
    } catch(err) {
      errorHandler(res.err)
    }
  },
  async deletePosts(req, res) {
    await Post.deleteMany({});
  }
}

module.exports = posts;