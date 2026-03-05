const rateLimit = require("express-rate-limit");

const SENSITIVE_FIELDS = [
  "password",
  "password_hash",
  "token",
  "accessToken",
  "refreshToken",
  "authorization",
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const createLimiter = ({ windowMs, max, message }) =>
  rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: message },
  });

const apiLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests. Please try again later.",
});

const authLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many authentication attempts. Please try again later.",
});

const sanitizeValue = (value) => {
  if (typeof value === "string") {
    return value
      .replace(/\0/g, "")
      .replace(/[\u0000-\u001F\u007F]/g, "")
      .trim();
  }

  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  if (value && typeof value === "object") {
    const sanitized = {};

    for (const key of Object.keys(value)) {
      if (["__proto__", "constructor", "prototype"].includes(key)) {
        continue;
      }

      sanitized[key] = sanitizeValue(value[key]);
    }

    return sanitized;
  }

  return value;
};

const sanitizeRequest = (req, res, next) => {
  if (req.body && typeof req.body === "object") {
    req.body = sanitizeValue(req.body);
  }
  next();
};

const maskSensitive = (input) => {
  if (!input || typeof input !== "object") return input;

  if (Array.isArray(input)) return input.map(maskSensitive);

  return Object.entries(input).reduce((acc, [key, value]) => {
    if (SENSITIVE_FIELDS.includes(key)) {
      acc[key] = "***";
      return acc;
    }

    acc[key] =
      value && typeof value === "object" ? maskSensitive(value) : value;
    return acc;
  }, {});
};

const requestLogger = (req, res, next) => {
  const started = Date.now();
  const safeBody = maskSensitive(req.body);

  res.on("finish", () => {
    const durationMs = Date.now() - started;
    console.info(
      `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} ${durationMs}ms`,
      {
        ip: req.ip,
        userAgent: req.get("user-agent"),
        body: safeBody,
      },
    );
  });

  next();
};

module.exports = {
  apiLimiter,
  authLimiter,
  sanitizeRequest,
  requestLogger,
  sleep,
};
