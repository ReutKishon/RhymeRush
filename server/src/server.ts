import dotenv from "dotenv";
dotenv.config();

process.on("uncaughtException", (err) => {
  // console.log(err.name, err.message);
  console.log(err);
  process.exit(1);
});

import app from "./app";
import "./redisClient";
// console.log(process.env.DATABASE,process.env.DATABASE_PASSWORD)
import { default as mongoose } from "mongoose";
const DB = process.env.DATABASE.replace(
  "<db_password>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`app running on port ${port} ...`);
});

process.on("unhandledRejection", (err: Error) => {
  console.log(err.name, err.message);
  server.close(() => {
    console.log("Server closed due to unhandled rejection");
    process.exit(1);
  });
});
