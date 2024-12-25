import {
  createPlayer,
  getGameFromRedis,
  isSentenceValid,
  nextTurn,
} from "../controllers/gameController";
import redisClient from "../redisClient";
import { Server } from "socket.io";
import { GameBase, Sentence } from "../../../shared/types/gameTypes";

let intervalId: NodeJS.Timeout | null = null;

export const leaveGame = async (gameCode: string, playerId: string) => {
  const game = await getGameFromRedis(gameCode);

  game.players = game.players.filter((p) => p.id != playerId);
  await redisClient.set(`game:${gameCode}`, JSON.stringify(game));
};

export const joinGame = async (gameCode: string, userName: string) => {
  if (!userName) {
    console.error("userName is null!!");
  }
  const game = await getGameFromRedis(gameCode);
  if (!getPlayer(game, userName)) {
    const joinedPlayer = await createPlayer(userName);
    game.players.push(joinedPlayer);

    await redisClient.set(`game:${gameCode}`, JSON.stringify(game));
    return joinedPlayer;
  }
  return null;
};

export const startGame = async (gameCode: string) => {
  try {
    const game = await getGameFromRedis(gameCode);
    game.isActive = true;
    await redisClient.set(`game:${gameCode}`, JSON.stringify(game));
  } catch (err) {
    console.error("Error starting game:", err);
  }
};

export const startTurnTimer = async (
  io: Server,
  gameCode: string,
  playerId: string
) => {
  let timer = 30;
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
  if (playerId != game.currentPlayerId) {
    //TODO: return error message
  }

  // Validate if the sentence meets the required criteria
  const sentenceIsValid = true; //await isSentenceValid(game, sentence);
  console.log("sentenceIsValid", sentenceIsValid);

  if (sentenceIsValid) {
    await addSentenceToSong(game, playerId, sentence, io);
  } else {
    stopTimer();
    await loosingHandler("invalidInput", playerId, game, io);
  }
};

const addSentenceToSong = async (
  game: GameBase,
  playerId: string,
  sentence: string,
  io: Server
) => {
  const sentenceData: Sentence = {
    content: sentence,
    playerId,
  };

  game.lyrics.push(sentenceData);
  nextTurn(game);
  await redisClient.set(`game:${game.code}`, JSON.stringify(game));
  io.to(game.code).emit("lyricsUpdated", sentenceData);
  io.to(game.code).emit("nextTurn", game.players[game.currentTurnIndex].id);
};

const startTimer = (
  io: Server,
  timer: number,
  game: GameBase,
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
      await loosingHandler("timeExpired", playerId, game, io);
    }
  }, 1000);
};

const stopTimer = () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
};

const loosingHandler = async (
  reason: "invalidInput" | "timeExpired",
  playerId: string,
  game: GameBase,
  io: Server
) => {
  const player = getPlayer(game, playerId);

  player.active = false;
  const activePlayers = Object.values(game.players).filter(
    (player) => player.active
  );
  player.rank = activePlayers.length;

  io.to(game.code).emit("updatelosing", reason, player);

  // end of the game
  if (player.rank == 1) {
    game.winnerPlayerId = activePlayers[0].id;
    io.to(game.code).emit("gameEnd");
  } else {
    nextTurn(game);
    io.to(game.code).emit("nextTurn", game.players[game.currentTurnIndex].id);
  }
  // io.emit(reason, player.id, player.rank);
  await redisClient.set(`game:${game.code}`, JSON.stringify(game));
};

const getPlayer = (game: GameBase, playerId: string) => {
  return game.players.find((p) => p.id == playerId);
};
