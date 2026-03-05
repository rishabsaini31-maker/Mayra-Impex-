const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.path,
  });
};

const errorHandler = (err, req, res, next) => {
  const statusCode = err.status || err.statusCode || 500;

  if (statusCode >= 500) {
    console.error("Unhandled error:", {
      message: err.message,
      stack: err.stack,
      path: req.originalUrl,
      method: req.method,
    });
  }

  res.status(statusCode).json({
    error: err.message || "Internal server error",
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
};

module.exports = {
  notFoundHandler,
  errorHandler,
};
