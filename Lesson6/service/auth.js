const jwt = require('jsonwebtoken');
const User = require('../models/users');
const successHandler = require('../service/successHandler');
const errorHandler = require('../service/errorHandler');
const asyncErrorHandler = require('../service/asyncErrorHandler');

const isAuth = asyncErrorHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split('')[1];
  }
  if (!token) {
    return next(errorHandler(401,"尚未登入"));
  }
  const decoded = await new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) {
        reject(err);
      } else {
        resolve(payload);
      }
    });
  });
  const currentUser = await User.findById(decoded.id);
  // 自訂, 帶下去
  req.user = currentUser;
  next();
});

const generateJWT = (user, res) => {
  const token = jwt.sign({id:user._id}, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_DAY,
  });
  successHandler(res, {
    token,
    name: user.name,
  });
}

module.exports = {
  isAuth,
  generateJWT,
}