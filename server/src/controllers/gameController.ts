import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import catchAsync from "../utils/catchAsync";
import redisClient from "../redisClient";
import generateSongTopic from "../utils/generateTopic";
import { getUserInfo } from "./authController";
import { AppError } from "../../../shared/utils/appError";
import { io } from "../app";
import { Game } from "types/gameTypes";
import { PlayerBase, Sentence, Song } from "../../../shared/types/gameTypes";
import { relatedToTopic, sentencesAreRhyme } from "../utils/sentencValidation";
import { CustomRequest } from "types/appTypes";
import UserModel from "../models/userModel";
import SongModel from "../models/songModel";

export const getGameFromRedis = async (gameCode: string) => {
  console.log("getGameFromRedis :", gameCode);
  const gameDataString = await redisClient.get(`game:${gameCode}`);
  if (!gameDataString) {
    throw new AppError(`Game with code ${gameCode} does not exist!`, 404);
  }
  return JSON.parse(gameDataString) as Game;
};

export const isSentenceValid = async (
  game: Game,
  sentence: string
): Promise<boolean> => {
  if (sentence.split(" ").length < 5) return false;

  if (!relatedToTopic(game.topic, sentence)) return false;

  if (game.lyrics.length > 0 && game.lyrics.length % 2 != 0) {
    return await sentencesAreRhyme(
      sentence,
      game.lyrics[game.lyrics.length - 1].content
    );
  }
};

export const createPlayer = async (playerId: string): Promise<PlayerBase> => {
  const user = await getUserInfo(playerId);
  const player = {
    id: playerId,
    name: user.username,
    active: true,
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

    const game: Game = {
      code: uniqueCode.slice(0, 12),
      topic: generateSongTopic(),
      players: { [gameCreatorId]: gameCreator },
      turnOrder: [gameCreator.id],
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
      data: { gameCode: game.code },
    });
  }
);

// export const joinGame = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const { playerId, gameCode } = req.params;

//     if (!playerId || !gameCode) {
//       return next(
//         new AppError("a player must join a game and provide their ID!", 401)
//       );
//     }
//     const game = await getGameFromRedis(gameCode);
//     if (game.players[playerId]) {
//       return next(
//         new AppError(`Player with ID ${playerId} is already in the game!`, 400)
//       );
//     }
//     const playerData = await createPlayer(playerId);

//     game.players[playerId] = playerData;
//     game.turnOrder.push(playerData.id);

//     await redisClient.set(`game:${gameCode}`, JSON.stringify(game));
//     io.to(gameCode).emit("gameUpdated", game);

//     res.status(200).json({
//       status: "success",
//       data: { joinedPlayer: playerData },
//     });
//   }
// );

// export const startGame = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const { gameCode } = req.params;

//     const gameData = await getGameFromRedis(gameCode);

//     gameData.isActive = true;
//     await redisClient.set(`game:${gameCode}`, JSON.stringify(gameData));
//     io.to(gameCode).emit("gameUpdated", gameData);

//     res.status(200).json({
//       status: "success",
//       message: "Game started successfully!",
//     });
//   }
// );

// export const deleteGame = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const { gameCode } = req.params;

//     if (!gameCode) {
//       return next(
//         new AppError("a game must be deleted by providing its code!", 401)
//       );
//     }
//     await redisClient.del(`game:${gameCode}`);
//     res.status(204).json({ status: "success", data: null });
//   }
// );

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

// const addSentenceToSong = async (
//   gameData: Game,
//   playerId: string,
//   sentence: string
// ) => {
//   const sentenceData: Sentence = {
//     content: sentence,
//     playerId,
//   };

//   gameData.lyrics.push(sentenceData);
// };

// export const loosingHandler = async (
//   reason: "invalidInput" | "timeExpired",
//   player: Player
// ) => {
//   player.active = false;
//   const socketId = getPlayerSocketId(player.id);
//   io.to(socketId).emit(reason);
// };

// export const addSentenceHandler = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const { gameCode, playerId } = req.params;
//     const { sentence } = req.body;

//     const gameData = await getGameFromRedis(gameCode);

//     // Check if it's the player's turn
//     if (playerId != gameData.turnOrder[gameData.currentTurnIndex]) {
//       return next(new AppError("It is not your turn!", 400));
//     }

//     // Validate if the sentence meets the required criteria
//     const sentenceIsValid = await isSentenceValid(gameData, sentence);

//     if (sentenceIsValid) {
//       await addSentenceToSong(gameData, playerId, sentence);
//     } else {
//       await loosingHandler("invalidInput", gameData.players[playerId]);
//     }

//     await checkForWinnerAndUpdateGame(gameData);

//     res.status(200).json({
//       status: "success",
//     });
//   }
// );

export const nextTurn = (gameData: Game) => {
  const getNextActivePlayerIndex = (
    startIndex: number,
    endIndex?: number
  ): number => {
    return (
      gameData.turnOrder
        ?.slice(startIndex, endIndex)
        .findIndex((playerId) => gameData.players[playerId].active) ?? -1
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

// function getActivePlayers(gameData: Game): Player[] {
//   return Object.values(gameData.players).filter((player) => player.active);
// }

// const declareWinner = (game: Game, activePlayers: Player[]) => {
//   game.winnerPlayerId = activePlayers[0].id;
//   io.to(game.code).emit("gameEnd", game);
// };

// // Function to continue the game if more than one active player is left
// const continueGame = async (game: Game) => {
//   nextTurn(game);
//   await redisClient.set(`game:${game.code}`, JSON.stringify(game));
//   io.to(game.code).emit("gameUpdated", game);
// };

// export const checkForWinnerAndUpdateGame = async (game: Game) => {
//   const activePlayers = getActivePlayers(game);

//   if (activePlayers.length === 1) {
//     declareWinner(game, activePlayers);
//   } else {
//     await continueGame(game);
//   }
// };

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
