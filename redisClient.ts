// src/redisClient.ts
import { createClient, RedisClientType } from '@redis/client';

// Create and configure the Redis client
const redisClient: RedisClientType = createClient({
  url: 'redis://localhost:6379',  // Replace with your actual Redis URL
});

// Connect to Redis
redisClient.connect().then(() => {
  console.log('Connected to Redis');
}).catch((err) => {
  console.error('Error connecting to Redis:', err);
});

// Export the Redis client for use in other modules
export default redisClient;
