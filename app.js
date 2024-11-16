const express = require("express");
const redis = require("redis");
const morgan = require("morgan");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
import userRouter from "./routes/userRoutes";
import gameRouter from "./routes/gameRoutes";
import AppError from "./utils/appError";
const globalErrorHandler = require("./controllers/errorController");
const app = express();

// @ts-ignore
//set security HTTP headers
app.use(helmet());

//development logging
if (process.env.NODE_ENV === "development") {
  // @ts-ignore
  app.use(morgan("dev"));
}

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

const redisClient = redis.createClient({
  url: "redis://redis:6379",
});

redisClient.connect().then(() => {
  console.log("Connected to Redis!");
});

app.use((req, res, next) => {
  // @ts-ignore
  req.redisClient = redisClient;
  next();
});

// Data sanitization against XSS attacks
app.use(xss());

app.use("/api/v1/users", userRouter);
app.use("/api/v1/game", gameRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});
app.use(globalErrorHandler);

module.exports = app;
