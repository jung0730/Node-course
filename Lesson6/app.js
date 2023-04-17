const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

// router
const postsRouter = require('./routes/posts');
const usersRouter = require('./routes/users');
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
app.use('/users', usersRouter);

// 錯誤列表，可再拆分
// 同步程式出錯(還是會掛掉，只是為了找戰犯)
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

// 404
app.use(function (req, res, next) {
  res.status(404).send({
    status: false,
    message: '該路由不存在',
  });
});

// Express middleware errors (可再區分dev 和prod 要回傳的錯誤)
const resErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: false,
      message: err.message
    })
  } else {
    res.status(500).json({
      status: 'error',
      message: 'system error'
    })
  }
}

const resErrorDev = (err, res) => {
  res.status(err.statusCode).send({
    status: false,
    message: err.message,
    error: err,
    stack: err.stack,
  });
}

app.use(function(err, req, res, next) {
  err.statusCode = err.statusCode || 500;
  if (process.env.NODE_ENV === 'dev') {
    return resErrorDev(err, res);
  }
  if (err.name === 'ValidationError') {
    err.message = "資料欄位未填寫正確"
    err.isOperational = true;
    resErrorProd(err, res);
  }
})

module.exports = app;