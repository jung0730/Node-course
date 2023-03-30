const mongoose = require('mongoose');

const schema = {
  content: {
    type: String,
    required: [true, '未填寫內容'],
  },
  image: {
    type: String,
    default: '',
  },
  name: {
    type: String,
    required: [true, '未填寫姓名'],
  },
  likes: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  }
}
const postSchema = new mongoose.Schema(schema);
const Post = mongoose.model('Post', postSchema);

module.exports = Post;