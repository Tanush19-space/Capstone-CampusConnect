const requestLogger = (req, res, next) => {
  const startTime = Date.now();

  res.on("finish", () => {
    console.log(
      `${req.method} ${req.originalUrl} | Status: ${res.statusCode} | ${Date.now() - startTime}ms`
    );
  });

  next();
};

module.exports = requestLogger;