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

    socket.on("joinGame", async (gameCode: string, joinedPlayer: Player) => {
      socket.join(gameCode);
      const game = await getGameFromRedis(gameCode);
      console.log("game ", game);
      io.to(gameCode).emit("gameUpdated", game);
    });

    // socket.on("leaveGame", (gameCode: string, playerId: string) => {
    //   console.log("leaveGame", gameCode, playerId);

    //   socket.leave(gameCode); // Leave the game room
    //   delete playerSocketMap[socket.id];
    //   io.to(gameCode).emit("playerLeft", playerId);

    // }

    socket.on("disconnect", () => {
      const playerInfo = playerSocketMap[socket.id];
      if (playerInfo) {
        io.to(playerInfo.gameCode).emit("playerLeft", playerInfo.playerId);
        delete playerSocketMap[socket.id];
      }
      console.log("A client disconnected");
    });
  });
};
