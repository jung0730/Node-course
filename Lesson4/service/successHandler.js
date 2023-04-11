const successHandler = (res, data) => {
  // 預設回200
  res.json({
    status: 'success',
    data: data,
  });
};

module.exports = successHandler;