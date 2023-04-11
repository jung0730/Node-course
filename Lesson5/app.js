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

// 同步程式出錯
process.on('uncaughtException', err => {
  console.error('Uncaught Exception');
  console.error(err);
  // 停掉process
  process.exit(1);
});

// handle Express middleware errors
// app.use(function(err, req, res, next) {
//   err.statusCode = err.statusCode || 500;
//   err.status = err.status || 'error';
//   res.status(err.statusCode).json({
//     status: err.status,
//     message: err.message
//   });
// });

const resErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
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

// 非同步程式錯誤(未捕捉到的 catch) 
process.on('unhandledRejection', (reason, promise) => {
  console.error('未捕捉到的 rejection：', promise, '原因：', reason);
})

module.exports = app;