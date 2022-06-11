const resSuccess = (res, statusCode, data) => {
  res.status(statusCode).send({
    status: true,
    data,
  });
};

module.exports = resSuccess;
