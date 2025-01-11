console.log('Starting the app...');
import dotenv from "dotenv";

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

import { server } from "./app";
import "./redisClient";

const port = process.env.PORT || 3000;
server.listen(Number(port), '0.0.0.0', () => {
  console.log(`app running on port ${port} ...`);
});

process.on("unhandledRejection", (err: Error) => {
  console.log(err.name, err.message);
});
