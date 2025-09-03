const errorHandler = (err, req, res, next) => {
  console.log(err);

  const { statusCode = 500, message = "Internal Server Error" } = err;
  res.status(statusCode).send({ message });
};

module.exports = errorHandler;
