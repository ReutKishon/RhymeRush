import { getGameFromRedis } from "../controllers/gameController";
import redisClient from "../redisClient";
import { Player, Sentence } from "../../../shared/types/gameTypes";
import { io } from "../app";
import { Game } from "types/gameTypes";

export const leaveGame = async (gameCode: string, playerName: string) => {
  const game = await getGameFromRedis(gameCode);

  game.players = game.players.filter((p) => p.name != playerName);
  await redisClient.set(
    `game:${gameCode}`,
    JSON.stringify(cleanGameForSerialization(game))
  );
};

export const startGame = async (gameCode: string) => {
  try {
    const game = await getGameFromRedis(gameCode);
    game.isActive = true;
    setTimeout(() => {
      io.to(gameCode).emit("gameOver");
    }, 5 * 10000);

    startTimer(game);

    await redisClient.set(
      `game:${game.code}`,
      JSON.stringify(cleanGameForSerialization(game))
    );
  } catch (err) {
    console.error("Error starting game:", err);
  }
};

export const handleAddSentenceSubmit = async (
  gameCode: string,
  playerName: string,
  sentence: string
) => {
  const game = await getGameFromRedis(gameCode);

  const player = getPlayer(game, playerName);
  if (!player) {
    throw new Error("Player doesn't exist!");
  }

  // Check if it's the player's turn
  if (playerName != game.players[game.currentTurnIndex].name) {
    throw new Error("It's not your turn!");
  }

  player.score += getSentenceValue(game, sentence);
  io.to(game.code).emit("updatePlayerScore", playerName, player.score);

  await addSentenceToSong(game, player, sentence);

  moveNextTurn(game);

  await redisClient.set(
    `game:${game.code}`,
    JSON.stringify(cleanGameForSerialization(game))
  );
};

const getSentenceValue = (game: Game, sentence: string) => {
  return 1;
};

const addSentenceToSong = async (
  game: Game,
  player: Player,
  sentence: string
) => {
  const sentenceData: Sentence = {
    content: sentence,
    player,
  };

  game.lyrics.push(sentenceData);
  io.to(game.code).emit("lyricsUpdated", sentenceData);
};

const getPlayer = (game: Game, playerName: string) => {
  return game.players.find((p) => p.name == playerName);
};

export const moveNextTurn = async (game: Game): Promise<void> => {
  if (game.currentTimerId) {
    clearTimeout(game.currentTimerId);
  }

  game.currentTurnIndex = (game.currentTurnIndex + 1) % game.players.length;

  io.to(game.code).emit(
    "UpdateCurrentPlayer",
    game.players[game.currentTurnIndex].name
  );

  startTimer(game);

  await redisClient.set(
    `game:${game.code}`,
    JSON.stringify(cleanGameForSerialization(game))
  );
};

const startTimer = (game: Game) => {
  const currPlayer = game.players[game.currentTurnIndex];
  game.currentTimerId = setTimeout(() => {
    console.log("timerout", currPlayer.name);
    currPlayer.score = 0;
    moveNextTurn(game);
  }, 30 * 1000); // 30 seconds
};

const cleanGameForSerialization = (game: Game): Partial<Game> => {
  const { currentTimerId, ...serializableGame } = game;
  return serializableGame;
};
