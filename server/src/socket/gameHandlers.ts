import {
  createPlayer,
  getGameFromRedis,
  isSentenceValid,
  nextTurn,
} from "../controllers/gameController";
import redisClient from "../redisClient";
import { Server, Socket } from "socket.io";
import { Game } from "../types/gameTypes";
import { PlayerBase, Sentence } from "../../../shared/types/gameTypes";

let intervalId: NodeJS.Timeout | null = null;

export const leaveGame = async (gameCode: string, playerId: string) => {
  const game = await getGameFromRedis(gameCode);

  if (playerId in game.players) {
    delete game.players[playerId];
  }

  await redisClient.set(`game:${gameCode}`, JSON.stringify(game));

  return game;
};

export const joinGame = async (
  socket: Socket,
  gameCode: string,
  playerId: string
) => {
  const game = await getGameFromRedis(gameCode);
  if (!(playerId in game.players)) {
    game.turnOrder.push(playerId);

    game.players[playerId] = await createPlayer(playerId);

    await redisClient.set(`game:${gameCode}`, JSON.stringify(game));
    return game;
  }
  return null;
};

export const startGame = async (gameCode: string) => {
  const game = await getGameFromRedis(gameCode);

  game.isActive = true;
  await redisClient.set(`game:${gameCode}`, JSON.stringify(game));
  return game;
};

export const startNewTurn = async (
  io: Server,
  gameCode: string,
  playerId: string
) => {
  let timer = 30;
  console.log("turnStarted");
  const game = await getGameFromRedis(gameCode);
  startTimer(io, timer, game, playerId);
};

export const addSentence = async (
  io: Server,
  gameCode: string,
  playerId: string,
  sentence: string
) => {

  const game = await getGameFromRedis(gameCode);

  // Check if it's the player's turn
  if (playerId != game.turnOrder[game.currentTurnIndex]) {
    //TODO: return error message
  }

  // Validate if the sentence meets the required criteria
  const sentenceIsValid = await isSentenceValid(game, sentence);

  if (sentenceIsValid) {
    await addSentenceToSong(game, playerId, sentence);
  } else {
    await loosingHandler(io, "invalidInput", game.players[playerId]);
  }

  await checkForWinnerAndUpdateGame(io, game);
};

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

const startTimer = (
  io: Server,
  timer: number,
  game: Game,
  playerId: string
) => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }

  intervalId = setInterval(async () => {
    if (timer > 0) {
      timer--;
      io.emit("timerUpdate", timer);
    } else {
      clearInterval(intervalId);
      intervalId = null;
      await loosingHandler(io, "timeExpired", game.players[playerId]);
      await checkForWinnerAndUpdateGame(io, game);
    }
  }, 1000);
};

const loosingHandler = async (
  io: Server,
  reason: "invalidInput" | "timeExpired",
  player: PlayerBase
) => {
  player.active = false;
  io.emit(reason, player.id);
};

const checkForWinnerAndUpdateGame = async (io: Server, game: Game) => {
  const activePlayers = Object.values(game.players).filter(
    (player) => player.active
  );

  if (activePlayers.length === 1) {
    game.winnerPlayerId = activePlayers[0].id;
  } else {
    nextTurn(game);
  }
  await redisClient.set(`game:${game.code}`, JSON.stringify(game));
  io.to(game.code).emit("gameUpdated", game);
};
