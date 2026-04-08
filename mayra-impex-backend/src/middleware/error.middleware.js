const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.path,
  });
};

const errorHandler = (err, req, res, next) => {
  let statusCode = err.status || err.statusCode || 500;
  let message = err.message || "Internal server error";

  if (err.name === "MulterError") {
    statusCode = 400;
    if (err.code === "LIMIT_FILE_SIZE") {
      message = "Image exceeds size limit (max 5MB).";
    }
  }

  if (err.code === "P2002") {
    statusCode = 409;
    message = "Duplicate record conflict.";
  }

  if (statusCode >= 500) {
    console.error("Unhandled error:", {
      message: err.message,
      stack: err.stack,
      path: req.originalUrl,
      method: req.method,
    });
  }

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
};

module.exports = {
  notFoundHandler,
  errorHandler,
};
