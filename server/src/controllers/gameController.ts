import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import catchAsync from "../utils/catchAsync";
import redisClient from "../redisClient";
import generateSongTopic from "../utils/generateTopic";
import { getUserInfo } from "./authController";
import { AppError } from "../../../shared/utils/appError";
import { io } from "../app";
import { Game, Player } from "types/gameTypes";
import { Sentence } from "../../../shared/types/gameTypes";
import { playerSocketMap } from "./socketController";

export const getGameFromRedis = async (gameCode: string) => {
  console.log("getGameFromRedis :", gameCode);
  const gameDataString = await redisClient.get(`game:${gameCode}`);
  if (!gameDataString) {
    throw new AppError(`Game with code ${gameCode} does not exist!`, 404);
  }
  return JSON.parse(gameDataString) as Game;
};

export const isSentenceValid = (gameData: Game, sentence: string): boolean => {
  const isLengthValid = sentence.split(" ").length == 5;
  // const isRhyme
  return isLengthValid;

  //TODO: check if sentence is related to the topic
};

export const getPlayerSocketId = (playerId: string) => {
  for (let socketId in playerSocketMap) {
    if (playerSocketMap[socketId].playerId === playerId) {
      return socketId;
    }
  }
  return null;
};

export const createPlayer = async (playerId: string): Promise<Player> => {
  const user = await getUserInfo(playerId);
  const socketId = getPlayerSocketId(playerId);
  const player = {
    id: playerId,
    name: user.username,
    active: true,
    socketId,
  };
  return player;
};

export const createGame = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { gameCreatorId } = req.body;

    if (!gameCreatorId) {
      return next(new AppError("a game must be created by a player!", 401));
    }

    const gameCreator = await createPlayer(req.body.gameCreatorId);
    const gameCode = uuidv4().slice(0, 12); // Generate a 6-char unique code

    const gameData: Game = {
      code: gameCode,
      topic: generateSongTopic(),
      players: { [gameCreatorId]: gameCreator },
      turnOrder: [gameCreator.id],
      currentTurnIndex: 0,
      isActive: false,
      currentPlayerId: gameCreator.id,
      lyrics: [],
      winnerPlayerId: null,
      gameCreatorId: gameCreatorId,
    };
    await redisClient.set(`game:${gameCode}`, JSON.stringify(gameData));

    res.status(201).json({
      status: "success",
      data: { gameCode },
    });
  }
);

export const joinGame = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { playerId, gameCode } = req.params;

    if (!playerId || !gameCode) {
      return next(
        new AppError("a player must join a game and provide their ID!", 401)
      );
    }
    const game = await getGameFromRedis(gameCode);
    if (game.players[playerId]) {
      return next(
        new AppError(`Player with ID ${playerId} is already in the game!`, 400)
      );
    }
    const playerData = await createPlayer(playerId);

    game.players[playerId] = playerData;
    game.turnOrder.push(playerData.id);

    await redisClient.set(`game:${gameCode}`, JSON.stringify(game));
    io.to(gameCode).emit("gameUpdated", game);

    res.status(200).json({
      status: "success",
      data: { joinedPlayer: playerData },
    });
  }
);

export const startGame = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { gameCode } = req.params;

    const gameData = await getGameFromRedis(gameCode);

    gameData.isActive = true;
    await redisClient.set(`game:${gameCode}`, JSON.stringify(gameData));
    io.to(gameCode).emit("gameUpdated", gameData);

    res.status(200).json({
      status: "success",
      message: "Game started successfully!",
    });
  }
);

export const deleteGame = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { gameCode } = req.params;

    if (!gameCode) {
      return next(
        new AppError("a game must be deleted by providing its code!", 401)
      );
    }
    await redisClient.del(`game:${gameCode}`);
    res.status(204).json({ status: "success", data: null });
  }
);

export const getGameInfo = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { gameCode } = req.params;
    if (!gameCode) {
      return next(
        new AppError(
          `a game must be retrieved by providing its code! ${gameCode}`,
          401
        )
      );
    }
    const gameData = await getGameFromRedis(gameCode);

    res.status(200).json({
      status: "success",
      data: { gameData },
    });
  }
);

const addSentenceToSong = async (
  gameData: Game,
  playerId: string,
  sentence: string
) => {
  const sentenceData: Sentence = {
    content: sentence,
    playerId,
  };

  gameData.lyrics.push(sentenceData);
};

export const addSentenceHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { gameCode, playerId } = req.params;
    const { sentence } = req.body;

    const gameData = await getGameFromRedis(gameCode);

    // Check if it's the player's turn
    if (playerId != gameData.currentPlayerId) {
      return next(new AppError("It is not your turn!", 400));
    }

    // Validate if the sentence meets the required criteria
    const sentenceIsValid = isSentenceValid(gameData, sentence);

    if (sentenceIsValid) {
      await addSentenceToSong(gameData, playerId, sentence);
    } else {
      gameData.players[playerId].active = false;
      const socketId = getPlayerSocketId(playerId);
      io.to(socketId).emit("invalidInput");
    }

    nextTurn(gameData);

    await redisClient.set(`game:${gameData.code}`, JSON.stringify(gameData));
    io.to(gameCode).emit("gameUpdated", gameData);

    if (gameData.winnerPlayerId) {
      io.to(gameData.code).emit("gameEnd");
    }

    res.status(200).json({
      status: "success",
    });
  }
);

const nextTurn = (gameData: Game) => {
  // Find the next active player, starting from the currentTurnIndex
  const nextActivePlayerIndex = gameData.turnOrder
    .slice(gameData.currentTurnIndex + 1) // Slice from the next index onward
    .findIndex((playerId) => gameData.players[playerId].active);

  if (nextActivePlayerIndex !== -1) {
    gameData.currentTurnIndex =
      gameData.currentTurnIndex + 1 + nextActivePlayerIndex;
  } else {
    // No active player found in the slice, search from the beginning
    const nextActivePlayerIndex = gameData.turnOrder
      .slice(0, gameData.currentTurnIndex)
      .findIndex((playerId) => gameData.players[playerId].active);

    if (nextActivePlayerIndex !== -1) {
      gameData.currentTurnIndex = nextActivePlayerIndex;
    } else {
      gameData.winnerPlayerId = gameData.turnOrder[gameData.currentTurnIndex];
    }
  }
};

export const getAllGames = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const gamesDataString = await redisClient.keys("game:*");
    const games: Game[] = [];

    for (const gameDataString of gamesDataString) {
      const gameData: Game = JSON.parse(await redisClient.get(gameDataString));
      games.push(gameData);
    }

    res.status(200).json({
      status: "success",
      data: { games },
    });
  }
);
