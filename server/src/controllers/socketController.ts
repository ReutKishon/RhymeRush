import { Server, Socket } from "socket.io";
import { Player } from "../../../shared/types/gameTypes";

const playerSocketMap: Record<string, { playerId: string; gameCode: string }> =
  {};

export const socketController = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log("New client connected");

    socket.on("createGame", (gameCode: string, playerId: string) => {
      socket.join(gameCode);
      playerSocketMap[socket.id] = { playerId, gameCode };
    });

    socket.on("joinGame", (gameCode: string, joinedPlayer: Player) => {
      socket.join(gameCode);
      playerSocketMap[socket.id] = { playerId: joinedPlayer.id, gameCode };
      io.to(gameCode).emit("playerJoined", joinedPlayer);
    });

    socket.on("updateGame", (gameCode: string) => {
      io.to(gameCode).emit("gameUpdated");
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
