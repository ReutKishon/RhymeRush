import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL,
  socket: {
    reconnectStrategy(retries, cause) {
      console.log(`Redis reconnecting... Attempt ${retries}.`);
      return 5000;
    },
  },
});

redisClient.connect()

redisClient.on("error", (err: Error) => {
  console.error("Redis error:", err);
});

redisClient.on("connect", () => {
  console.log("Redis connected");
});

export default redisClient;
