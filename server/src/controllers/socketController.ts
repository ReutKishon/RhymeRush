import { Server, Socket } from "socket.io";
import { Game, Player } from "../../../shared/types/gameTypes";
import { createGame, getGameFromRedis, getPlayerData } from "./gameController";

const playerSocketMap: Record<string, { playerId: string; gameCode: string }> =
  {};

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
    });

    socket.on("leaveGame", async (playerId: string, gameCode: string) => {
      socket.leave(gameCode);
      delete playerSocketMap[socket.id];
      const game = await getGameFromRedis(gameCode);
      io.to(gameCode).emit("gameUpdated", game);
    });

    socket.on("startTurn", (currentPlayerId: string) => {
      const timer = 30;
      console.log("turnStarted")

      startTimer(timer, currentPlayerId);
    });

    // socket.on("nextTurn", () => {
    //   timer = 30; // Reset timer for the new turn
    //   io.emit("turnUpdate", {
    //     currentPlayer: players[currentPlayerIndex],
    //     timer,
    //   });
    // });

    // socket.on("leaveGame", (gameCode: string, playerId: string) => {
    //   console.log("leaveGame", gameCode, playerId);

    //   socket.leave(gameCode); // Leave the game room
    //   delete playerSocketMap[socket.id];
    //   io.to(gameCode).emit("playerLeft", playerId);

    // }

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

  const startTimer = (timer: number, currentPlayerId: string) => {
    let intervalId = null;

    intervalId = setInterval(() => {
      if (timer > 0) {
        timer--;
        io.emit("timerUpdate", timer); // Broadcast timer to all clients
      } else {
        clearInterval(intervalId);
        intervalId = null;
        io.emit("timeExpired", currentPlayerId);
      }
    }, 1000);
  };
};
