// src/redisClient.ts
import { createClient } from "redis";

// Create and configure the Redis client
const redisClient = createClient({
  url: "redis://redis-server:6379", // Replace with your actual Redis URL
});

// Connect to Redis
redisClient
  .connect()
  .then(() => {
    console.log("Connected to Redis");
  })
  .catch((err: Error) => {
    console.error("Error connecting to Redis:", err);
  });

// Export the Redis client for use in other modules
export default redisClient;
