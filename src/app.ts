import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
// import xss from "xss-clean";
import userRouter from "./routes/userRoutes";
import gameRouter from "./routes/gameRoutes";
import { MyError } from "./utils/appError";
import globalErrorHandler from "./controllers/errorController";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

const io = new Server(server);

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("add sentence", (sentence) => {
    io.emit("add sentence", sentence);
  });
});
//set security HTTP headers
app.use(helmet());

//development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS attacks
// app.use(xss());

app.use("/api/v1/users", userRouter);
app.use("/api/v1/game", gameRouter);

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  next(new MyError(`Can't find ${req.originalUrl} on this server`, 404));
});
app.use(globalErrorHandler);

export default app;
