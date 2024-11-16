import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import catchAsync from "../utils/catchAsync";
import { generateSongTopic } from "../utils/gameUtils";
import {MyError} from "../utils/appError";
import { Game, Player } from "../types/gameTypes";
import redisClient from "../redisClient";

export const createGame = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.gameCreatorId) {
      return next(new MyError("a game must be created by a player!", 401));
    }
    const gameCreatorPlayer: Player = {
      id: req.body.gameCreatorId,
    };
    const gameCode = uuidv4().slice(0, 6); // Generate a 6-char unique code

    const gameData: Game = {
      gameCode: gameCode,
      topic: generateSongTopic(),
      maxPlayers: 4,
      players: [gameCreatorPlayer],
      isStarted: false,
      currentTurn: 0,
      song: [],
      turnTimer: 40,
    };
    await redisClient.set(`game:${gameCode}`, JSON.stringify(gameData));

    res.status(201).json({
      status: "success",
      data: { gameData },
    });
  }
);
