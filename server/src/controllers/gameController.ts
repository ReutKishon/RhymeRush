import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import catchAsync from "../utils/catchAsync";
import { AppError } from "../../../shared/utils/appError";
import { Game, Player, Sentence } from "../../../shared/types/gameTypes";
import redisClient from "../redisClient";
import generateSongTopic from "../utils/generateTopic";
import { io } from "../app";
import { getUserInfo } from "./authController";
import { getRandomColor } from "../utils/colorGenerator";

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
  return sentence.split(" ").length == gameData.sentenceLengthAllowed;
  //TODO: check if sentence is related to the topic
};

export const getPlayerData = async (playerId: string) => {
  const user = await getUserInfo(playerId);
  const playerData: Player = {
    id: playerId,
    username: user.username,
    color: getRandomColor(),
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
      gameCode: gameCode,
      topic: generateSongTopic(),
      maxPlayers: 2,
      players: [gameCreator],
      isStarted: false,
      currentTurn: 0,
      sentenceLengthAllowed: 5,
      lyrics: [],
      winner: null,
    };
    await redisClient.set(`game:${gameCode}`, JSON.stringify(gameData));

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
    const playerData = await getPlayerData(playerId);
    console.log("joined player: ", playerData);
    if (isPlayerInGame(gameData.players, playerId)) {
      return next(
        new AppError(`Player with ID ${playerId} is already in the game!`, 400)
      );
    }

    gameData.players.push(playerData);
    await redisClient.set(`game:${gameCode}`, JSON.stringify(gameData));
    res.status(200).json({
      status: "success",
      joinedPlayer: playerData,
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

const leaveGame = async (gameData: Game, playerId: string) => {
  if (gameData.currentTurn == gameData.players.length - 1) {
    gameData.currentTurn = 0;
  }
  gameData.players = gameData.players.filter((p) => p.id !== playerId);

  if (gameData.players.length === 0) {
    await redisClient.del(`game:${gameData.gameCode}`);
  }

  console.log(
    "turnIndex: " + gameData.currentTurn,
    " play4ers: " + gameData.players
  );

  await redisClient.set(`game:${gameData.gameCode}`, JSON.stringify(gameData));
};

export const leaveGameHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { playerId, gameCode } = req.params;

    if (!req.params.playerId || !req.params.gameCode) {
      return next(
        new AppError("a player must join a game and provide their ID!", 401)
      );
    }
    const gameData = await getGameFromRedis(gameCode);

    if (!isPlayerInGame(gameData.players, playerId)) {
      return next(
        new AppError(`Player with ID ${playerId} is not in the game!`, 400)
      );
    }
    leaveGame(gameData, playerId);
    res.status(200).json({ status: "success", data: gameData });
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

const addSentenceToSong = async (
  gameData: Game,
  player: Player,
  sentence: string
) => {
  const sentenceData: Sentence = {
    content: sentence,
    player,
    timestamp: new Date(),
  };

  gameData.lyrics.push(sentenceData);
  gameData.currentTurn =
    gameData.currentTurn == gameData.players.length - 1
      ? 0
      : (gameData.currentTurn += 1);

  await redisClient.set(`game:${gameData.gameCode}`, JSON.stringify(gameData));
};

export const addSentenceHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { gameCode, playerId } = req.params;
    const { sentence } = req.body;

    const gameData = await getGameFromRedis(gameCode);

    // Check if it's the player's turn
    const playerIndex = getPlayerIndex(gameData.players, playerId);
    if (playerIndex != gameData.currentTurn) {
      return next(new AppError("It is not your turn!", 400));
    }

    const playerData = gameData.players[playerIndex];

    // Validate if the sentence meets the required criteria
    if (!isSentenceValid(gameData, sentence)) {
      if (gameData.players.length === 2) {
        gameOver(gameData, playerId);
      } else {
        leaveGame(gameData, playerId);
        io.to(gameCode).emit("playerLost", playerData);
        console.log("CurrentTurn: ", gameData.players[gameData.currentTurn]);
        io.to(gameCode).emit(
          "updatedTurn",
          gameData.players[gameData.currentTurn]
        );
      }

      res.status(200).json({
        status: "success",
        data: { sentenceIsValid: false },
      });
      return;
    }

    await addSentenceToSong(gameData, playerData, sentence);

    res.status(200).json({
      status: "success",
      data: { sentenceIsValid: true, gameData },
    });
  }
);

export const startGame = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { gameCode } = req.params;

    const gameData = await getGameFromRedis(gameCode);

    // Check if there are enough players to start the game
    if (gameData.players.length < 2) {
      return next(
        new AppError("At least 2 players are required to start a game!", 400)
      );
    }

    gameData.isStarted = true;
    await redisClient.set(`game:${gameCode}`, JSON.stringify(gameData));

    res.status(200).json({
      status: "success",
      message: "Game started successfully!",
      data: { gameData },
    });
  }
);

const gameOver = (gameData: Game, lostPlayerId: string) => {
  const winner = gameData.players.find((player) => player.id !== lostPlayerId);

  io.to(gameData.gameCode).emit("gameEnd", winner);
};

export const checkGameStarted = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { gameCode } = req.params;

  const gameData = await getGameFromRedis(gameCode);

  if (!gameData.isStarted) {
    return next(new AppError("The game has not started yet!", 400));
  }
  next();
};
