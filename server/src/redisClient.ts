import { createClient } from "redis";

// Create and configure the Redis client
const redisClient = createClient({
  url: "redis://localhost:6379"
});

redisClient
  .connect()
  .then(() => {
    console.log("Connected to Redis");
  })
  .catch((err: Error) => {
    console.error("Error connecting to Redis:", err);
  });

export default redisClient;
