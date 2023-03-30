const errorHandler = (res, message) => {
  res.status(400).json({
    status: 'false',
    message,
  });
};

module.exports = errorHandler;