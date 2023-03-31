const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

// router
const postsRouter = require('./routes/posts');
var app = express();

require('./connections');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/posts', postsRouter);

// 同步程式出錯
process.on('uncaughtException', err => {
  console.error('Uncaught Exception');
  console.error(err);
  // 停掉process
  process.exit(1);
});

// 非同步程式錯誤(未捕捉到的 catch) 
process.on('unhandledRejection', (reason, promise) => {
  console.error('未捕捉到的 rejection：', promise, '原因：', reason);
})

module.exports = app;