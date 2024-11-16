import { Request, Response, NextFunction } from "express";
const { v4: uuidv4 } = require("uuid");
const catchAsync = require("../utils/catchAsync");
import { generateSongTopic } from "../utils/gameUtils";
import AppError from "../utils/appError";
import { Game, Player } from "../types/gameTypes";

export const createGame = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.gameCreatorId) {
      return next(new AppError("a game must be created by a player!", 401));
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
    // @ts-ignore
    await req.redisClient.set(`game:${gameCode}`, JSON.stringify(gameData));

    res.status(201).json({
      status: "success",
      data: { gameData },
    });
  }
);
