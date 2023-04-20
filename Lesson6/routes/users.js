const express = require("express");
const router = express.Router();
const User = require('../models/users');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const errorHandler = require('../service/errorHandler');
const successHandler = require('../service/successHandler');
const asyncErrorHandler = require('../service/asyncErrorHandler');
const { isAuth, generateJWT } = require('../service/auth');

router.post(
  '/sign_up',
  asyncErrorHandler(async (req, res, next) => {
    const { name, email, confirmPassword } = req.body;
    let { password } = req.body;
    if (!name || !email || !password) return next(errorHandler(400,"欄位未填寫正確"));
    // 密碼是否有大於 8 碼
    if (!validator.isLength(password, { min: 8 })) {
      return next(errorHandler(400,"密碼不得低於 8 字元"));
    }
    if (password !== confirmPassword) return next(errorHandler(400,"密碼不一致"));
    // 是否為 Email 格式
    if (!validator.isEmail(email)) return next(errorHandler(400,"信箱格式錯誤"));
    // 密碼加密
    password = await bcrypt.hash(password, 12);
    const data = await User.create({
      name,
      email,
      password,
    });
    generateJWT(data, res);
  })
);

router.post(
  '/sign_in',
  asyncErrorHandler(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(errorHandler(400,"帳號密碼不可為空"));
    }
    // 如果omit '.select('+password')'
    // The returned object will only contain properties that are explicitly included in the schema, and any excluded fields (such as the password field, in this case) will be omitted.
    const data = await User.findOne({ email }).select('+password');
    const auth = await bcrypt.compare(password, data.password);
    if (!auth) {
      return next(errorHandler(400,"密碼錯誤"));
    };
    generateJWT(data, res);
  })
);

router.post(
  '/updatePassword',
  isAuth,
  asyncErrorHandler(async (req, res, next) => {
    const { confirmPassword } = req.body;
    let { password } = req.body;
    const { _id } = req.user;
    if (password !== confirmPassword) return next(errorHandler(400,"兩次密碼不一致"));
    if (!validator.isLength(password, { min: 8 })) {
      return next(errorHandler(400,"密碼不得低於8字元"));
    }
    password = await bcrypt.hash(password, 12);
    const data = await User.findByIdAndUpdate(_id,{password});
    // generating a new JWT token can be important for ensuring that the user's credentials remain secure and for re-authenticating the user with the server.
    generateJWT(data, res);
  })
);

router.get(
  '/profile',
  isAuth,
  asyncErrorHandler(async (req, res) => {
    successHandler(res, { user: req.user });
  })
);

router.patch(
  '/profile',
  isAuth,
  asyncErrorHandler(async (req, res, next) => {
    const { _id } = req.user;
    const { name, photo, sex } = req.body;
    if (sex !== 'boy' || sex !== 'girl') {
      return next(errorHandler(401,"sex 僅可輸入 boy 或 girl"));
    }
    const data = await User.findByIdAndUpdate(_id, {
      name,
      photo,
      sex,
    });
    successHandler(res, data);
  })
);