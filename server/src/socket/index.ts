import { Server, Socket } from "socket.io";
import {
  addSentence,
  joinGame,
  leaveGame,
  startGame,
  startNewTurn,
} from "./gameHandlers";

export const playerSocketMap: Record<
  string,
  { playerId: string; gameCode: string }
> = {};
export const socketHandler = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log("New client connected");

    socket.on(
      "gameCreated",
      async (gameCode: string, gameCreatorId: string) => {
        joinSocketToGameRoom(gameCode, gameCreatorId);
      }
    );

    socket.on("joinGame", async (playerId: string, gameCode: string) => {
      try {
        const game = await joinGame(socket, gameCode, playerId);
        if (game) {
          joinSocketToGameRoom(gameCode, playerId);
          io.to(game.code).emit("gameUpdated", game);
        }
      } catch (err) {
        socket.emit("error", err);
        return;
      }
    });

    socket.on("leaveGame", async () => {
      if (!(socket.id in playerSocketMap)) {
        console.error(`No player data found for socket ID: ${socket.id}`);
        return;
      }

      const { playerId, gameCode } = playerSocketMap[socket.id];

      try {
        const game = await leaveGame(gameCode, playerId);
        removeSocketFromGameRoom(gameCode);
        io.to(game.code).emit("gameUpdated", game);
      } catch (error) {
        console.error("Error leaving game:", error);
      }
    });

    socket.on("startGame", async () => {
      const { gameCode } = playerSocketMap[socket.id];
      const game = await startGame(gameCode);
      io.to(game.code).emit("gameUpdated", game);
    });

    socket.on("startNewTurn", async (gameCode: string, playerId: string) => {
      await startNewTurn(io, gameCode, playerId);
    });

    socket.on("addSentence", async (sentence: string) => {
      const { gameCode, playerId } = playerSocketMap[socket.id];
      await addSentence(io, gameCode, playerId, sentence);
    });

    socket.on("disconnect", async () => {
      const { gameCode, playerId } = playerSocketMap[socket.id];
      removeSocketFromGameRoom(gameCode);
      const game = await leaveGame(gameCode, playerId);
      if (game) {
        io.to(game.code).emit("gameUpdated", game);
      }
      console.log("A client disconnected");
    });

    const joinSocketToGameRoom = (gameCode: string, playerId: string) => {
      socket.join(gameCode);
      playerSocketMap[socket.id] = { playerId, gameCode };
    };

    const removeSocketFromGameRoom = (gameCode: string) => {
      socket.leave(gameCode);
      delete playerSocketMap[socket.id];
    };
  });
};
