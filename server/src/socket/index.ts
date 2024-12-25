import { Server, Socket } from "socket.io";
import {
  addSentence,
  joinGame,
  leaveGame,
  startGame,
  startTurnTimer,
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
        await joinSocketToGameRoom(gameCode, gameCreatorId);
      }
    );

    socket.on("joinGame", async (playerId: string, gameCode: string) => {
      const joinedPlayer = await joinGame(gameCode, playerId);
      console.log("joinedPlayer", joinedPlayer);
      await joinSocketToGameRoom(gameCode, playerId);
      if (joinedPlayer) {
        console.log("testjoined");
        io.to(gameCode).emit("playerJoined", joinedPlayer);
      }
    });

    // socket.on("leaveGame", async () => {
    //   console.log("test3");

    //   if (!(socket.id in playerSocketMap)) {
    //     console.error(`No player data found for socket ID: ${socket.id}`);
    //     return;
    //   }
    //   console.log("test1");
    //   const { playerId, gameCode } = playerSocketMap[socket.id];
    //   console.log("test2");
    //   await leaveGame(gameCode, playerId);
    //   removeSocketFromGameRoom(gameCode);
    //   io.to(gameCode).emit("playerLeft", playerId);
    // });

    socket.on("startGame", async () => {
      try {
        const { gameCode } = playerSocketMap[socket.id];

        await startGame(gameCode);
        io.to(gameCode).emit("gameStarted",);
      } catch (err) {
        console.error("Error starting game:", err);
      }
    });

    socket.on("startTimer", async (gameCode: string, playerId: string) => {
      await startTurnTimer(io, gameCode, playerId);
    });

    socket.on("addSentence", async (sentence: string) => {
      try {
        const { gameCode, playerId } = playerSocketMap[socket.id];
        await addSentence(io, gameCode, playerId, sentence);
      } catch (err) {
        console.error("Error adding sentence:", err);
      }
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
