const { createClient } = require("redis");

let redisClient = null;
let connectPromise = null;

const getRedisClient = () => {
  if (redisClient) return redisClient;

  if (!process.env.REDIS_URL) {
    return null;
  }

  redisClient = createClient({
    url: process.env.REDIS_URL,
  });

  redisClient.on("error", (error) => {
    console.error("Redis client error:", error.message);
  });

  redisClient.on("reconnecting", () => {
    console.warn("Redis reconnecting...");
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
        return client;
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
