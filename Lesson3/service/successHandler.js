const successHandler = (res, data) => {
  res.status(200).json({
    status: 'success',
    data: data,
  });
};

module.exports = successHandler;