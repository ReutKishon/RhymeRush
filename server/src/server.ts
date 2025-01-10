import dotenv from "dotenv";
dotenv.config();

import { server } from "./app";
import "./redisClient";

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`app running on port ${port} ...`);
});

process.on("unhandledRejection", (err: Error) => {
  console.log(err.name, err.message);
});
