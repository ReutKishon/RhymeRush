import { Request, Response, NextFunction } from "express";
import catchAsync from "../utils/catchAsync";
import redisClient from "../redisClient";
import generateSongTopic from "../utils/generateTopic";
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
import { io } from "../app";
import { handlePlayerLoss } from "../socket/gameHandlers";
import { Game } from "../types/gameTypes";

export const getGameFromRedis = async (gameCode: string) => {
  const gameDataString = await redisClient.get(`game:${gameCode}`);

  return JSON.parse(gameDataString) as Game;
};

export const isSentenceValid = async (
  game: Game,
  sentence: string
): Promise<boolean> => {
  console.log("isSentenceValid1");
  if (sentence.split(" ").length < 5) return false;
  console.log("isSentenceValid2");

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

export const createPlayer = async (playerName: string): Promise<Player> => {
  // const user = await getUserInfo(playerId);
  const player = {
    name: playerName,
    active: true,
    rank: 0,
    color: getColorById(playerName),
  };
  return player;
};

export const createGame = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { uniqueCode, userName } = req.body;

    if (!userName) {
      return next(new AppError("a game must be created by a player!", 401));
    }

    const gameCreator = await createPlayer(userName);

    const game: Game = {
      code: uniqueCode.slice(0, 12),
      topic: generateSongTopic(),
      players: [gameCreator],
      currentTurnIndex: 0,
      isActive: false,
      currentPlayerName: gameCreator.name,
      lyrics: [],
      winnerPlayerName: null,
      gameCreatorName: gameCreator.name,
      songId: uniqueCode,
      currentTimerId: null,
    };
    await redisClient.set(`game:${game.code}`, JSON.stringify(game));
    res.status(201).json({
      status: "success",
      data: { game },
    });
  }
);

export const joinGame = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userName, gameCode } = req.params;

    const game = await getGameFromRedis(gameCode);
    if (!game) {
      return next(
        new AppError("Invalid game code or the game does not exist.", 404)
      );
    }

    if (game.players.find((p) => p.name === userName)) {
      return next(new AppError(`${userName} is already taken!`, 401));
    }

    const joinedPlayer = await createPlayer(userName);
    game.players.push(joinedPlayer);

    await redisClient.set(`game:${game.code}`, JSON.stringify(game));
    res.status(201).json({
      status: "success",
      data: { joinedPlayer },
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
