import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import catchAsync from "../utils/catchAsync";
import { Game, Player, Sentence } from "../../../shared/types/gameTypes";
import redisClient from "../redisClient";
import generateSongTopic from "../utils/generateTopic";
import { getUserInfo } from "./authController";
import { getRandomColor } from "../utils/colorGenerator";
import { AppError } from "../../../shared/utils/appError";
import { io } from "../app";

const getGameFromRedis = async (gameCode: string) => {
  const gameDataString = await redisClient.get(`game:${gameCode}`);
  if (!gameDataString) {
    throw new AppError(`Game with code ${gameCode} does not exist!`, 404);
  }
  return JSON.parse(gameDataString) as Game;
};

const getPlayerIndex = (players: Player[], playerId: string): number => {
  return players.findIndex((player) => player.id === playerId);
};

const isPlayerInGame = (players: Player[], playerId: string): boolean => {
  return getPlayerIndex(players, playerId) != -1;
};

const isSentenceValid = (gameData: Game, sentence: string): boolean => {
  const isLengthValid = sentence.split(" ").length == 5;
  // const isRhyme
  return isLengthValid;

  //TODO: check if sentence is related to the topic
};

export const getPlayerData = async (playerId: string) => {
  const user = await getUserInfo(playerId);
  const playerData: Player = {
    id: playerId,
    name: user.username,
  };
  return playerData;
};

export const createGame = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { gameCreatorId } = req.body;

    if (!gameCreatorId) {
      return next(new AppError("a game must be created by a player!", 401));
    }

    const gameCreator = await getPlayerData(req.body.gameCreatorId);
    const gameCode = uuidv4().slice(0, 12); // Generate a 6-char unique code

    const gameData: Game = {
      code: gameCode,
      topic: generateSongTopic(),
      players: [gameCreator],
      isActive: false,
      currentPlayerId: gameCreator.id,
      lyrics: [],
      winnerPlayerId: null ,
      gameCreatorId: gameCreatorId,
    };
    await redisClient.set(`game:${gameCode}`, JSON.stringify(gameData));
    io.to(gameCode).emit("gameUpdated", gameData);

    res.status(201).json({
      status: "success",
      data: { gameData },
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
    const gameData = await getGameFromRedis(gameCode);
    if (isPlayerInGame(gameData.players, playerId)) {
      return next(
        new AppError(`Player with ID ${playerId} is already in the game!`, 400)
      );
    }
    const playerData = await getPlayerData(playerId);

    gameData.players.push(playerData);
    await redisClient.set(`game:${gameCode}`, JSON.stringify(gameData));
    io.to(gameCode).emit("gameUpdated", gameData);

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

const removePlayer = async (gameData: Game, playerId: string) => {
  const currentPlayerIdx = gameData.players.findIndex((p) => p.id === playerId);
  if (currentPlayerIdx== gameData.players.length - 1) {
    gameData.currentPlayerId = gameData.players[0].id
  }
  gameData.players = gameData.players.filter((p) => p.id !== playerId);
};

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
    player: playerId,
  };

  gameData.lyrics.push(sentenceData);
  const currentPlayerIdx = gameData.players.findIndex((p) => p.id === playerId);
  const nextTurnPlayerIdx =
    currentPlayerIdx == gameData.players.length - 1 ? 0 : currentPlayerIdx + 1;

  gameData.currentPlayerId = gameData.players[nextTurnPlayerIdx].id;
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
      await redisClient.set(`game:${gameData.code}`, JSON.stringify(gameData));
      io.to(gameCode).emit("gameUpdated", gameData);
    }
    res.status(200).json({
      status: "success",
      sentenceIsValid,
    });
  }
);

export const handlePlayerLoss = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { gameCode, playerId } = req.params;
    const gameData = await getGameFromRedis(gameCode);

    if (gameData.players.length === 2) {
      gameData.winnerPlayerId = gameData.players.find(
        (player) => player.id !== playerId
      ).id;
    } else {
      removePlayer(gameData, playerId);
    }
    await redisClient.set(`game:${gameData.code}`, JSON.stringify(gameData));
    io.to(gameCode).emit("gameUpdated", gameData);

    res.status(200).json({
      status: "success",
    });
  }
);

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
