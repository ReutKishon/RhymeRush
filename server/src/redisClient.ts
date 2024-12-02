import { createClient } from "redis";

// Create and configure the Redis client
const redisClient = createClient({
  url: "redis://redis-server:6379", // Replace with your actual Redis URL
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
