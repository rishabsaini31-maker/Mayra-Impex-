const { createClient } = require("redis");

let redisClient = null;
let connectPromise = null;
let redisUnavailableLogged = false;

const shouldUseTls = (redisUrl = "") => {
  if (!redisUrl) return false;
  if (redisUrl.startsWith("rediss://")) return true;

  try {
    const { hostname } = new URL(redisUrl);
    return hostname.endsWith("upstash.io");
  } catch {
    return false;
  }
};

const getRedisClient = () => {
  if (redisClient) return redisClient;

  if (!process.env.REDIS_URL) {
    return null;
  }

  const tlsEnabled = shouldUseTls(process.env.REDIS_URL);

  redisClient = createClient({
    url: process.env.REDIS_URL,
    socket: {
      tls: tlsEnabled,
      connectTimeout: 10000,
      keepAlive: 5000,
      reconnectStrategy: (retries) => {
        // Exponential-ish backoff and then stop retrying to avoid log spam loops.
        if (retries > 12) {
          return false;
        }
        return Math.min(250 * retries, 5000);
      },
    },
  });

  redisClient.on("error", (error) => {
    console.error("Redis client error:", error.message);
  });

  redisClient.on("reconnecting", () => {
    console.warn("Redis reconnecting...");
  });

  redisClient.on("ready", () => {
    redisUnavailableLogged = false;
  });

  redisClient.on("end", () => {
    if (!redisUnavailableLogged) {
      console.warn("Redis connection ended. Falling back gracefully.");
      redisUnavailableLogged = true;
    }
  });

  return redisClient;
};

const connectRedis = async () => {
  const client = getRedisClient();

  if (!client) return null;
  if (client.isOpen) return client;

  if (!connectPromise) {
    connectPromise = client
      .connect()
      .then(() => {
        console.log("✅ Redis connected");
        redisUnavailableLogged = false;
        return client;
      })
      .catch((error) => {
        if (!redisUnavailableLogged) {
          console.warn(
            "Redis unavailable. Continuing without Redis-backed protections:",
            error.message,
          );
          redisUnavailableLogged = true;
        }
        return null;
      })
      .finally(() => {
        connectPromise = null;
      });
  }

  return connectPromise;
};

const setNonceIfNotExists = async (key, ttlMs) => {
  const client = await connectRedis();
  if (!client) return null;

  const result = await client.set(key, "1", {
    NX: true,
    PX: ttlMs,
  });

  return result === "OK";
};

const incrementCounterWithTtl = async (key, ttlMs) => {
  const client = await connectRedis();
  if (!client) return null;

  const count = await client.eval(
    `
      local current = redis.call('INCR', KEYS[1])
      if current == 1 then
        redis.call('PEXPIRE', KEYS[1], ARGV[1])
      end
      return current
    `,
    {
      keys: [key],
      arguments: [String(ttlMs)],
    },
  );

  return Number(count);
};

module.exports = {
  connectRedis,
  setNonceIfNotExists,
  incrementCounterWithTtl,
};
