const mongoose = require('mongoose');

// const roomSchema = {
//   name: String,
//   price: {
//     type: Number,
//     required: true,
//   },
//   rating: Number,
// }
const roomSchema = new mongoose.Schema(
  {
    name: String,
    price: {
      type: Number,
      required: true,
    },
    rating: Number,
    createdAt: {
      type: Date,
      default: Date.now,
      select: false // 保護createdAt 欄位, 不被find到
    }
  },
  {
    versionKey: false,
    // timestamps: true,
    // collection: 'room', 覆寫collection name
  }
)

// Room -> rooms
// 開頭強制轉小寫
// 結尾強制加上s
const Room = mongoose.model('Room', roomSchema);

module.exports = Room;