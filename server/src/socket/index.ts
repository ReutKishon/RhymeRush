import { Server, Socket } from "socket.io";
import { handleAddSentenceSubmit, leaveGame, startGame } from "./gameHandlers";
import { Player } from "../../../shared/types/gameTypes";
import { createPlayer, getGameFromRedis } from "../controllers/gameController";
import redisClient from "../redisClient";

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
        await joinSocketToGameRoom(gameCode, gameCreatorId);
      }
    );

    socket.on(
      "playerJoined",
      async (gameCode: string, playerJoined: Player) => {
        joinSocketToGameRoom(gameCode, playerJoined.name);
        io.to(gameCode).emit("playerJoined", playerJoined);
      }
    );

    socket.on("startGame", async () => {
      try {
        if (!(socket.id in playerSocketMap)) {
          console.error(`No player data found for socket ID: ${socket.id}`);
          return;
        }
        const { gameCode } = playerSocketMap[socket.id];
        await startGame(gameCode);
        io.to(gameCode).emit("gameStarted");
      } catch (err) {
        console.error("Error starting game:", err);
      }
    });

    socket.on("addSentence", async (sentence: string) => {
      try {
        console.log("addSentence", sentence);
        const { gameCode, playerId } = playerSocketMap[socket.id];
        await handleAddSentenceSubmit(gameCode, playerId, sentence);
      } catch (err) {
        console.log(err);
        const message = "Failed to send sentence. Please try again.";
        io.to(socket.id).emit("errorAddingSentence", message);
      }
    });
    socket.on("addAIPlayer", async () => {
      try {
        const { gameCode } = playerSocketMap[socket.id];
        const game = await getGameFromRedis(gameCode);
        const AIPlayer = await createPlayer("AI");
        game.players.push(AIPlayer);
        await redisClient.set(`game:${game.code}`, JSON.stringify(game));
        io.to(gameCode).emit("playerJoined", AIPlayer);
      } catch (err) {
        console.log(err);
      }
    });
    socket.on("removeAIPlayer", async () => {
      try {
        const { gameCode } = playerSocketMap[socket.id];
        await leaveGame(gameCode, "AI");
        io.to(gameCode).emit("playerLeft", "AI");
      } catch (err) {
        console.log(err);
        const message = "Failed to send sentence. Please try again.";
        io.to(socket.id).emit("errorAddingSentence", message);
      }
    });
    socket.on("leaveGame", async () => {
      try {
        if (!(socket.id in playerSocketMap)) {
          console.error(`No player data found for socket ID: ${socket.id}`);
          return;
        }
        const { playerId, gameCode } = playerSocketMap[socket.id];
        await leaveGame(gameCode, playerId);
        removeSocketFromGameRoom(gameCode);
        io.to(gameCode).emit("playerLeft", playerId);
      } catch (err) {}
    });

    socket.on("disconnect", async (reason) => {
      console.log(`Socket disconnected. Reason: ${reason}`);
      const playerData = playerSocketMap[socket.id];
      if (!playerData) {
        console.error(`No player data found for socket ID: ${socket.id}`);
        return;
      }

      const { gameCode, playerId } = playerSocketMap[socket.id];
      await removeSocketFromGameRoom(gameCode);
      await leaveGame(gameCode, playerId);

      io.to(gameCode).emit("playerLeft", playerId);

      console.log("A client disconnected");
    });

    const joinSocketToGameRoom = async (gameCode: string, playerId: string) => {
      await socket.join(gameCode);
      playerSocketMap[socket.id] = { playerId, gameCode };
    };

    const removeSocketFromGameRoom = async (gameCode: string) => {
      await socket.leave(gameCode);
      delete playerSocketMap[socket.id];
    };
  });
};
