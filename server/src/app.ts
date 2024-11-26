import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
// import xss from "xss-clean";
import cors from "cors";
import userRouter from "./routes/userRoutes";
import gameRouter from "./routes/gameRoutes";
import globalErrorHandler from "./controllers/errorController";

import http from "http";
import { Server, Socket } from "socket.io";
import { Player, Sentence } from "../../shared/types/gameTypes";
import { AppError } from "../../shared/utils/appError";

const app = express();
const server = http.createServer(app);

app.use(
  cors({
    origin: "http://localhost:5000", // Frontend URL
    methods: "GET,POST,PATCH", // Allow specific methods
    allowedHeaders: "Content-Type", // Allow specific headers
  })
);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5000",
    methods: ["GET", "POST"],
  },
});
const playerSocketMap: Record<string, { playerId: string; gameCode: string }> =
  {};

io.on("connection", (socket: Socket) => {
  console.log("New client connected");

  socket.on("createGame", (gameCode: string, playerId: string) => {
    socket.join(gameCode);
    playerSocketMap[socket.id] = { playerId: playerId, gameCode };
  });

  socket.on("joinGame", (gameCode: string, player: Player) => {
    socket.join(gameCode);
    playerSocketMap[socket.id] = { playerId: player.id, gameCode };
    // console.log(`Player ${player.username} joined the game ${gameCode}`);
    io.to(gameCode).emit("playerJoined", player);
  });

  socket.on("leaveGame", (gameCode: string, playerId: string) => {
    socket.leave(gameCode); // Leave the game room
    io.to(gameCode).emit("playerLeft", playerId);
    delete playerSocketMap[socket.id];
    // console.log(`Player ${playerId} left the game ${gameCode}`);
  });

  socket.on("addSentence", (gameCode: string, updatedLyrics: Sentence[]) => {
    io.to(gameCode).emit("updatedLyrics", updatedLyrics);
  });

  socket.on("updateTurn", (gameCode: string, currentTurnPlayer: Player) => {
    io.to(gameCode).emit("updatedTurn", currentTurnPlayer);
  });

  socket.on("disconnect", () => {
    const playerInfo = playerSocketMap[socket.id];
    if (playerInfo) {
      // Emit that the player left the game
      io.to(playerInfo.gameCode).emit("playerLeft", playerInfo.playerId);
      delete playerSocketMap[socket.id];
    }
    console.log("A client disconnected");
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
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});
app.use(globalErrorHandler);

export { server, io };
