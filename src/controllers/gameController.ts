import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import catchAsync from "../utils/catchAsync";
import { generateSongTopic } from "../utils/gameUtils";
import { MyError } from "../utils/appError";
import { Game, Player, Sentence } from "../types/gameTypes";
import redisClient from "../redisClient";
import { ObjectId } from "mongoose";

const getGameFromRedis = async (gameCode: string) => {
  const gameDataString = await redisClient.get(`game:${gameCode}`);
  if (!gameDataString) {
    throw new MyError(`Game with code ${gameCode} does not exist!`, 404);
  }
  return JSON.parse(gameDataString) as Game;
};

const isPlayerInGame = (gameData: Game, playerId: string): boolean => {
  return gameData.players.some((player) => player.id === playerId);
};

const isSentenceValid = (gameData: Game, sentence: string): boolean => {
  console.log(sentence.split(" ").length,gameData.sentenceLengthAllowed)
  return sentence.split(" ").length == gameData.sentenceLengthAllowed;
  //TODO: check for topic relation and for time it took
};

export const createGame = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.gameCreatorId) {
      return next(new MyError("a game must be created by a player!", 401));
    }
    const gameCreatorPlayer: Player = {
      id: req.body.gameCreatorId,
    };
    const gameCode = uuidv4().slice(0, 12); // Generate a 6-char unique code

    const gameData: Game = {
      gameCode: gameCode,
      topic: generateSongTopic(),
      maxPlayers: 2,
      players: [gameCreatorPlayer],
      isStarted: false,
      currentTurn: 0,
      sentenceLengthAllowed: 5,
      song: [],
      turnTimer: 40,
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
        new MyError("a player must join a game and provide their ID!", 401)
      );
    }
    const gameData = await getGameFromRedis(gameCode);

    if (isPlayerInGame(gameData, playerId)) {
      return next(
        new MyError(`Player with ID ${playerId} is already in the game!`, 400)
      );
    }

    gameData.players.push({ id: playerId });
    await redisClient.set(`game:${gameCode}`, JSON.stringify(gameData));

    res.status(200).json({
      status: "success",
      data: { gameData },
    });
  }
);

export const exitGame = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { playerId, gameCode } = req.params;

    if (!req.params.playerId || !req.params.gameCode) {
      return next(
        new MyError("a player must join a game and provide their ID!", 401)
      );
    }
    const gameData = await getGameFromRedis(gameCode);

    if (isPlayerInGame(gameData, playerId)) {
      return next(
        new MyError(`Player with ID ${playerId} is already in the game!`, 400)
      );
    }
    gameData.players = gameData.players.filter((p) => p.id !== playerId);
    await redisClient.set(`game:${gameCode}`, JSON.stringify(gameData));

    res.status(204).json({ status: "success", data: null });
  }
);

export const getGameInfo = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { gameCode } = req.params;

    if (!gameCode) {
      return next(
        new MyError("a game must be retrieved by providing its code!", 401)
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

export const addSentenceToSong = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { gameCode, playerId } = req.params;
    const { sentence } = req.body;

    if (!sentence) {
      return next(new MyError("A sentence is required!", 400));
    }

    const gameData = await getGameFromRedis(gameCode);

    if (!isSentenceValid(gameData, sentence)) {
      const rivalIdx = 1 - gameData.currentTurn;
      gameData.winner = gameData.players[rivalIdx];
      return res.status(200).json({
        status: "success",
        data: { gameData },
      });
    }
    const sentenceData: Sentence = {
      content: sentence,
      player: { id: playerId } as Player,
      timestamp: new Date(),
    };

    gameData.song.push(sentenceData);

    await redisClient.set(`game:${gameCode}`, JSON.stringify(gameData));

    res.status(200).json({
      status: "success",
      data: { gameData },
    });
  }
);
