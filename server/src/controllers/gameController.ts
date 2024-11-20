import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import catchAsync from "../utils/catchAsync";
import { MyError } from "../utils/appError";
import { Game, Player, Sentence } from "../../../shared/types/gameTypes";
import redisClient from "../redisClient";
import generateSongTopic from "../utils/generateTopic";

const getGameFromRedis = async (gameCode: string) => {
  const gameDataString = await redisClient.get(`game:${gameCode}`);
  if (!gameDataString) {
    throw new MyError(`Game with code ${gameCode} does not exist!`, 404);
  }
  return JSON.parse(gameDataString) as Game;
};

const isPlayerInGame = (gameData: Game, playerId: string): number => {
  return gameData.players.findIndex((player) => player.id === playerId);
};

const isSentenceValid = (gameData: Game, sentence: string): boolean => {
  return sentence.split(" ").length == gameData.sentenceLengthAllowed;
  //TODO: check if sentence is related to the topic
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
        new MyError("a player must join a game and provide their ID!", 401)
      );
    }
    const gameData = await getGameFromRedis(gameCode);

    if (isPlayerInGame(gameData, playerId) != -1) {
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

    if (isPlayerInGame(gameData, playerId) == -1) {
      return next(
        new MyError(`Player with ID ${playerId} is not in the game!`, 400)
      );
    }

    gameData.players = gameData.players.filter((p) => p.id !== playerId);
    if (gameData.players.length === 0) {
      await redisClient.del(`game:${gameCode}`); //delete game key from redis
      return res.status(204).json({ status: "success", data: null });
    }
    await redisClient.set(`game:${gameCode}`, JSON.stringify(gameData));

    res.status(200).json({ status: "success", data: gameData });
  }
);

export const getGameInfo = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { gameCode } = req.params;
    if (!gameCode) {
      return next(
        new MyError(`a game must be retrieved by providing its code! ${gameCode}`, 401)
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

    const gameData = await getGameFromRedis(gameCode);

    // Check if it's the player's turn
    const currPlayerIdx = isPlayerInGame(gameData, playerId);
    if (currPlayerIdx != gameData.currentTurn) {
      return next(new MyError("It is not your turn!", 400));
    }
    // Check if a sentence has been provided
    if (!sentence) {
      return next(new MyError("A sentence is required!", 400));
    }
    // Validate if the sentence meets the required criteria
    if (!isSentenceValid(gameData, sentence)) {
      await redisClient.del(`game:${gameCode}`); //delete game key from redis
      const rivalIdx = 1 - gameData.currentTurn;
      gameData.winner = gameData.players[rivalIdx]; //set the winner to be the rival player
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

    gameData.lyrics.push(sentenceData);

    await redisClient.set(`game:${gameCode}`, JSON.stringify(gameData));

    res.status(200).json({
      status: "success",
      data: { gameData },
    });
  }
);

export const startNewTurn = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { gameCode } = req.params;

    const gameData = await getGameFromRedis(gameCode);

    gameData.currentTurn = 1 - gameData.currentTurn; // switch turns

    await redisClient.set(`game:${gameCode}`, JSON.stringify(gameData));

    res.status(200).json({
      status: "success",
      data: { gameData },
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
        new MyError("At least 2 players are required to start a game!", 400)
      );
    }

    // Check if the game has already started
    if (gameData.isStarted) {
      return next(new MyError("The game has already started!", 400));
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

// export const finishGame = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const { gameCode } = req.params;

//     const gameData = await getGameFromRedis(gameCode);

//     // Check if the game has already ended
//     if (!gameData.isStarted) {
//       return next(new MyError("The game has already ended!", 400));
//     }
//     await redisClient.del(`game:${gameCode}`); //delete game key from redis

//     res.status(200).json({
//       status: "success",
//       message: "Game ended successfully!",
//       data: { gameData },
//     });
//   }
// );

export const checkGameStarted = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { gameCode } = req.params;

  const gameData = await getGameFromRedis(gameCode);

  if (!gameData.isStarted) {
    return next(new MyError("The game has not started yet!", 400));
  }
  next();
};
