import { Server, Socket } from "socket.io";
import { Game, Player } from "../../../shared/types/gameTypes";
import { createGame } from "./gameController";

const playerSocketMap: Record<string, { playerId: string; gameCode: string }> =
  {};

import { v4 as uuidv4 } from "uuid";
import generateSongTopic from "../utils/generateTopic";
import redisClient from "../redisClient";

export const socketController = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log("New client connected");

    socket.on("createGame", async (playerId: string) => {

      const gameCode = uuidv4().slice(0, 12); // Generate a 6-char unique code
  
      const gameData: Game = {
        code: gameCode,
        topic: generateSongTopic(),
        players: [{
          id: playerId,
          name: "sdfsdf"
        }],
        isActive: false,
        currentPlayerId: playerId,
        lyrics: [],
        winnerPlayerId: null,
        gameCreatorId: playerId,
      };
      await redisClient.set(`game:${gameCode}`, JSON.stringify(gameData));
      io.to(gameCode).emit("gameUpdated", gameData);

      socket.join(gameCode);
      playerSocketMap[socket.id] = { playerId, gameCode };
    });

    socket.on("joinGame", (gameCode: string, joinedPlayer: Player) => {
      socket.join(gameCode);
      playerSocketMap[socket.id] = { playerId: joinedPlayer.id, gameCode };
      io.to(gameCode).emit("playerJoined", joinedPlayer);
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
