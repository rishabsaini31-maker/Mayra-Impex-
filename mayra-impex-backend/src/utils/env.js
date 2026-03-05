const requiredEnv = ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY", "JWT_SECRET"];

const validateEnv = () => {
  if (!process.env.JWT_REFRESH_SECRET && process.env.JWT_SECRET) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("JWT_REFRESH_SECRET is required in production");
    }
    process.env.JWT_REFRESH_SECRET = process.env.JWT_SECRET;
  }

  if (process.env.NODE_ENV === "production" && !process.env.REDIS_URL) {
    throw new Error("REDIS_URL is required in production");
  }

  const missing = requiredEnv.filter((key) => !process.env[key]);

  if (missing.length) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`,
    );
  }
};

module.exports = {
  validateEnv,
};
