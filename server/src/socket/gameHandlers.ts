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

export const leaveGame = async (gameCode: string, playerName: string) => {
  const game = await getGameFromRedis(gameCode);

  game.players = game.players.filter((p) => p.name != playerName);
  await redisClient.set(`game:${gameCode}`, JSON.stringify(game));
};

export const joinGame = async (gameCode: string, playerName: string) => {
  if (!playerName) {
    console.error("playerName is null!!");
  }
  const game = await getGameFromRedis(gameCode);
  const playerInGame = getPlayer(game, playerName);
  if (playerInGame) {
    throw new Error("Name is already taken!");
  }
  const joinedPlayer = await createPlayer(playerName);
  game.players.push(joinedPlayer);

  await redisClient.set(`game:${gameCode}`, JSON.stringify(game));
  return joinedPlayer;
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
  playerName: string,
  sentence: string
) => {
  const game = await getGameFromRedis(gameCode);

  // Check if it's the player's turn
  if (playerName != game.players[game.currentTurnIndex].name) {
    throw new Error("It's not your turn!");
  }

  // Validate if the sentence meets the required criteria
  const sentenceIsValid = true; //await isSentenceValid(game, sentence);
  console.log("sentenceIsValid", sentenceIsValid);

  if (sentenceIsValid) {
    await addSentenceToSong(game, playerName, sentence, io);
  } else {
    stopTimer();
    await loosingHandler("invalidInput", playerName, game, io);
  }
};

const addSentenceToSong = async (
  game: GameBase,
  playerName: string,
  sentence: string,
  io: Server
) => {
  const sentenceData: Sentence = {
    content: sentence,
    playerName: playerName,
  };

  game.lyrics.push(sentenceData);
  nextTurn(game);
  await redisClient.set(`game:${game.code}`, JSON.stringify(game));
  io.to(game.code).emit("lyricsUpdated", sentenceData);
  io.to(game.code).emit("nextTurn", game.players[game.currentTurnIndex].name);
};

const startTimer = (
  io: Server,
  timer: number,
  game: GameBase,
  playerName: string
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
      await loosingHandler("timeExpired", playerName, game, io);
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
    game.winnerPlayerName = activePlayers[0].name;
    io.to(game.code).emit("gameEnd");
  } else {
    nextTurn(game);
    io.to(game.code).emit("nextTurn", game.players[game.currentTurnIndex].name);
  }
  // io.emit(reason, player.id, player.rank);
  await redisClient.set(`game:${game.code}`, JSON.stringify(game));
};

const getPlayer = (game: GameBase, playerName: string) => {
  return game.players.find((p) => p.name == playerName);
};
