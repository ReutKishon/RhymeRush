import {
  getGameFromRedis,
  isSentenceValid,
} from "../controllers/gameController";
import redisClient from "../redisClient";
import { Player, Sentence } from "../../../shared/types/gameTypes";
import { io } from "../app";
import { Game } from "types/gameTypes";

export const leaveGame = async (gameCode: string, playerName: string) => {
  const game = await getGameFromRedis(gameCode);

  game.players = game.players.filter((p) => p.name != playerName);
  await redisClient.set(`game:${gameCode}`, JSON.stringify(game));
};

export const startGame = async (gameCode: string) => {
  try {
    const game = await getGameFromRedis(gameCode);
    game.isActive = true;
    await redisClient.set(`game:${gameCode}`, JSON.stringify(game));
    startTurn(game);
  } catch (err) {
    console.error("Error starting game:", err);
  }
};

const stopTimer = (game: Game) => {
  if (game.currentTimerId) {
    clearTimeout(game.currentTimerId);
    game.currentTimerId = undefined; // Reset the timer ID
  }
};

export const addSentence = async (
  gameCode: string,
  playerName: string,
  sentence: string
) => {
  const game = await getGameFromRedis(gameCode);
  stopTimer(game);

  const player = getPlayer(game, playerName);
  if (!player) {
    throw new Error("Player doesn't exist!");
  }

  // Check if it's the player's turn
  if (playerName != game.players[game.currentTurnIndex].name) {
    throw new Error("It's not your turn!");
  }

  // Validate if the sentence meets the required criteria
  const sentenceIsValid = await isSentenceValid(game, sentence);
  console.log("sentenceIsValid", sentenceIsValid);

  if (sentenceIsValid) {
    await addSentenceToSong(game, player, sentence);
  } else {
    await handlePlayerLoss("invalidInput", player, game);
  }
  if (!game.winnerPlayerName) {
    nextTurn(game);
    startTurn(game);
  }

  await redisClient.set(`game:${game.code}`, JSON.stringify(game));
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
  await redisClient.set(`game:${game.code}`, JSON.stringify(game));
  io.to(game.code).emit("lyricsUpdated", sentenceData);
};

export const handlePlayerLoss = async (
  reason: "invalidInput" | "timeExpired",
  player: Player,
  game: Game
) => {
  player.active = false;
  const activePlayers = Object.values(game.players).filter(
    (player) => player.active
  );
  console.log("active players: " + JSON.stringify(activePlayers, null, 2));
  player.rank = activePlayers.length;
  io.to(game.code).emit("updatelosing", player, reason);

  // end of the game
  if (player.rank == 1) {
    game.winnerPlayerName = activePlayers[0].name;
    setTimeout(() => {
      stopTimer(game);
      io.to(game.code).emit("gameEnd");
    }, 4000);
  }
  await redisClient.set(`game:${game.code}`, JSON.stringify(game));
};

const getPlayer = (game: Game, playerName: string) => {
  return game.players.find((p) => p.name == playerName);
};

export const nextTurn = (game: Game) => {
  const getNextActivePlayerIndex = (
    startIndex: number,
    endIndex?: number
  ): number => {
    return (
      game.players?.slice(startIndex, endIndex).findIndex((p) => p.active) ?? -1
    );
  };

  // Find the next active player, starting from the currentTurnIndex
  let nextActivePlayerIndex = getNextActivePlayerIndex(
    game.currentTurnIndex + 1
  );

  if (nextActivePlayerIndex !== -1) {
    game.currentTurnIndex = game.currentTurnIndex + 1 + nextActivePlayerIndex;
  } else {
    // No active player found in the slice, search from the beginning
    nextActivePlayerIndex = getNextActivePlayerIndex(0, game.currentTurnIndex);

    if (nextActivePlayerIndex !== -1) {
      game.currentTurnIndex = nextActivePlayerIndex;
    }
  }
};

const startTurn = (game: Game) => {
  const currentPlayer = game.players[game.currentTurnIndex];
  io.to(game.code).emit("UpdateCurrentPlayer", currentPlayer.name);

  const TIMER_DURATION = 32 * 1000; // 30 seconds

  if (game.currentTimerId) {
    clearTimeout(game.currentTimerId);
  }

  game.currentTimerId = setTimeout(() => {
    console.log("timerExpired");
    handlePlayerLoss("timeExpired", currentPlayer, game);
    // Move to the next turn
    nextTurn(game);
    // Start the new turn
    startTurn(game);
  }, TIMER_DURATION);
};
