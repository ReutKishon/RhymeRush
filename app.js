const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const appError = require("./utils/appError");
const userRouter = require("./routes/userRoutes");
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

// Data sanitization against XSS attacks
app.use(xss());

app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
  next(new appError(`Can't find ${req.originalUrl} on this server`, 404));
});
app.use(globalErrorHandler);

module.exports = app;
