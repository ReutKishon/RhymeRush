import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import catchAsync from "../utils/catchAsync";
import redisClient from "../redisClient";
import generateSongTopic from "../utils/generateTopic";
import { getUserInfo } from "./authController";
import { AppError } from "../../../shared/utils/appError";
import { GameBase, Player, Song } from "../../../shared/types/gameTypes";
import {
  isRelatedToTopic,
  sentencesAreRhyme,
} from "../utils/sentencValidation";
import { CustomRequest } from "types/appTypes";
import UserModel from "../models/userModel";
import SongModel from "../models/songModel";
import { getColorById } from "../utils/colorGenerator";

export const getGameFromRedis = async (gameCode: string) => {
  console.log("getGameFromRedis :", gameCode);
  const gameDataString = await redisClient.get(`game:${gameCode}`);
  if (!gameDataString) {
    throw new AppError(`Game with code ${gameCode} does not exist!`, 404);
  }
  return JSON.parse(gameDataString) as GameBase;
};

export const isSentenceValid = async (
  game: GameBase,
  sentence: string
): Promise<boolean> => {
  if (sentence.split(" ").length < 5) return false;

  const relatedToTopic = await isRelatedToTopic(game.topic, sentence);
  console.log("relatedToTopic :", relatedToTopic);
  if (!relatedToTopic) return false;

  if (game.lyrics.length > 0 && game.lyrics.length % 2 != 0) {
    return await sentencesAreRhyme(
      sentence,
      game.lyrics[game.lyrics.length - 1].content
    );
  }
  return true;
};

export const createPlayer = async (playerId: string): Promise<Player> => {
  const user = await getUserInfo(playerId);
  const player = {
    id: playerId,
    name: user.username,
    active: true,
    rank: 0,
    color: getColorById(playerId),
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
    const uniqueCode = uuidv4();

    const game: GameBase = {
      code: uniqueCode.slice(0, 12),
      topic: generateSongTopic(),
      players: [gameCreator],
      // turnOrder: [gameCreator.id],
      currentTurnIndex: 0,
      isActive: false,
      currentPlayerId: gameCreator.id,
      lyrics: [],
      winnerPlayerId: null,
      gameCreatorId: gameCreatorId,
      songId: uniqueCode,
    };
    await redisClient.set(`game:${game.code}`, JSON.stringify(game));
    res.status(201).json({
      status: "success",
      data: { game },
    });
  }
);

export const getGameInfo = catchAsync(async (req: CustomRequest, res, next) => {
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
});

export const nextTurn = (gameData: GameBase) => {
  const getNextActivePlayerIndex = (
    startIndex: number,
    endIndex?: number
  ): number => {
    return (
      gameData.players
        ?.slice(startIndex, endIndex)
        .findIndex((p) => p.active) ?? -1
    );
  };

  // Find the next active player, starting from the currentTurnIndex
  let nextActivePlayerIndex = getNextActivePlayerIndex(
    gameData.currentTurnIndex + 1
  );

  if (nextActivePlayerIndex !== -1) {
    gameData.currentTurnIndex =
      gameData.currentTurnIndex + 1 + nextActivePlayerIndex;
  } else {
    // No active player found in the slice, search from the beginning
    nextActivePlayerIndex = getNextActivePlayerIndex(
      0,
      gameData.currentTurnIndex
    );

    if (nextActivePlayerIndex !== -1) {
      gameData.currentTurnIndex = nextActivePlayerIndex;
    }
  }
};

export const getAllGames = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const gamesDataString = await redisClient.keys("game:*");
    const games: GameBase[] = [];

    for (const gameDataString of gamesDataString) {
      const gameData: GameBase = JSON.parse(
        await redisClient.get(gameDataString)
      );
      games.push(gameData);
    }

    res.status(200).json({
      status: "success",
      data: { games },
    });
  }
);

export const deleteAllGames = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const keys = await redisClient.keys("game:*"); // Assuming game keys are prefixed with "game:"
      if (keys.length > 0) {
        await redisClient.del(keys);
      }
      res.status(200).json({ message: "All game keys deleted successfully." });
    } catch (error) {
      console.error("Error deleting games:", error);
      res.status(500).json({ error: "Failed to delete game keys." });
    }
  }
);

export const saveSong = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { gameCode } = req.params;
    const userId = req.userId;

    if (!gameCode) {
      return next(new AppError("Invalid song data provided!", 400));
    }
    const gameData = await getGameFromRedis(gameCode);

    const song: Song = {
      _id: gameData.songId,
      topic: gameData.topic,
      lyrics: gameData.lyrics,
      createdAt: new Date(),
    };
    createSong(song);
    addSongToUser(userId, song._id);
  }
);

const createSong = async (song: Song) => {
  try {
    const doc = await SongModel.create(song);
    console.log(doc);
  } catch (err) {
    if (err.code === 11000) {
      return;
    } else {
      throw err;
    }
  }
};

const addSongToUser = async (userId: string, songId: string) => {
  try {
    const userDoc = await UserModel.findOne({ _id: userId, songs: songId });
    if (!userDoc) {
      await UserModel.findByIdAndUpdate(userId, { $push: { songs: songId } });
    }
  } catch (err) {
    throw err;
  }
};
