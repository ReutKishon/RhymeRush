import { Server, Socket } from "socket.io";
import {
  checkForWinnerAndUpdateGame,
  getGameFromRedis,
  loosingHandler,
} from "./gameController";
import { Game } from "types/gameTypes";

export const playerSocketMap: Record<
  string,
  { playerId: string; gameCode: string }
> = {};

let intervalId: NodeJS.Timeout | null = null;
export const socketController = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log("New client connected");

    socket.on("createGame", async (gameCode: string, playerId: string) => {
      console.log("Creating game");
      socket.join(gameCode);

      playerSocketMap[socket.id] = { playerId, gameCode };
    });

    socket.on("joinGame", async (playerId: string, gameCode: string) => {
      socket.join(gameCode);
      playerSocketMap[socket.id] = { playerId, gameCode };
      console.log(playerSocketMap);
    });

    socket.on("leaveGame", async (playerId: string, gameCode: string) => {
      socket.leave(gameCode);
      delete playerSocketMap[socket.id];
      // const game = await getGameFromRedis(gameCode);
      // io.to(gameCode).emit("gameUpdated", game);
    });

    socket.on("startTurn", async (playerId: string, gameCode: string) => {
      let timer = 30;
      console.log("turnStarted");
      const game = await getGameFromRedis(gameCode);
      startTimer(timer, game, playerId);
    });

    socket.on("disconnect", () => {
      const playerInfo = playerSocketMap[socket.id];
      if (playerInfo) {
        socket.leave(playerInfo.gameCode);
        io.to(playerInfo.gameCode).emit("playerLeft", playerInfo.playerId);
        delete playerSocketMap[socket.id];
      }
      console.log("A client disconnected");
    });
  });

  const startTimer = (timer: number, game: Game, playerId: string) => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }

    intervalId = setInterval(async () => {
      if (timer > 0) {
        timer--;
        io.emit("timerUpdate", timer);
      } else {
        clearInterval(intervalId);
        intervalId = null;
        await loosingHandler("timeExpired", game.players[playerId]);
        await checkForWinnerAndUpdateGame(game);
      }
    }, 1000);
  };
};
