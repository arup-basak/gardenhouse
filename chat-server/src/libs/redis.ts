import Redis from "ioredis";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

const redis = new Redis(REDIS_URL);

redis.on("connect", () => {
  console.log("⚡️[REDIS]: CONNECTED TO REDIS");
});

redis.on("error", (error) => {
  console.error("Redis connection error:", error);
});

export default redis;
