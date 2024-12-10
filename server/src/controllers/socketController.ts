import { Server, Socket } from "socket.io";

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
    });

    socket.on("leaveGame", async (playerId: string, gameCode: string) => {
      socket.leave(gameCode);
      delete playerSocketMap[socket.id];
      // const game = await getGameFromRedis(gameCode);
      // io.to(gameCode).emit("gameUpdated", game);
    });

    socket.on("startTurn", (currentPlayerId: string) => {
      const timer = 30;
      console.log("turnStarted");

      startTimer(timer, currentPlayerId);
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

  const startTimer = (timer: number, currentPlayerId: string) => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }

    intervalId = setInterval(() => {
      if (timer > 0) {
        timer--;
        io.emit("timerUpdate", timer);
      } else {
        clearInterval(intervalId);
        intervalId = null;
        io.emit("timeExpired");
      }
    }, 1000);
  };
};
