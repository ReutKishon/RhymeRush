import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import cors from "cors";
import userRouter from "./routes/userRoutes";
import gameRouter from "./routes/gameRoutes";
import globalErrorHandler from "./controllers/errorController";
import http from "http";
import { Server } from "socket.io";
import { AppError } from "../../shared/utils/appError";
import { socketHandler } from "./socket";

const app = express();

app.use(cors())

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins
    methods: ["GET", "POST"], // Allow specific HTTP methods
  },
});

socketHandler(io);

// //set security HTTP headers
// app.use(helmet());

//development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Body parser, reading data from body into req.body
app.use(express.json());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

app.use("/api/v1/users", userRouter);
app.use("/api/v1/game", gameRouter);

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  // next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
  res.status(404).json('Not found')
});

app.use(globalErrorHandler);

export { server, io };
