import { getGameFromRedis } from "../controllers/gameController";
import redisClient from "../redisClient";
import { Server } from "socket.io";
import { GameBase, Sentence } from "../../../shared/types/gameTypes";
import { io } from "../app";

export const leaveGame = async (gameCode: string, playerName: string) => {
  const game = await getGameFromRedis(gameCode);

  game.players = game.players.filter((p) => p.name != playerName);
  await redisClient.set(`game:${gameCode}`, JSON.stringify(game));
};

export const startGame = async (gameCode: string, io: Server) => {
  try {
    const game = await getGameFromRedis(gameCode);
    game.isActive = true;
    await redisClient.set(`game:${gameCode}`, JSON.stringify(game));
    startTurn(game);
  } catch (err) {
    console.error("Error starting game:", err);
  }
};

export const addSentence = async (
  io: Server,
  gameCode: string,
  playerName: string,
  sentence: string
) => {
  const game = await getGameFromRedis(gameCode);

  if (game.currentTimerId) {
    clearTimeout(game.currentTimerId);
    game.currentTimerId = undefined; // Reset the timer ID
  }

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
    await handlePlayerLoss("invalidInput", playerName, gameCode, io);
  }

  nextTurn(game);
  startTurn(game);
  await redisClient.set(`game:${game.code}`, JSON.stringify(game));
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
  await redisClient.set(`game:${game.code}`, JSON.stringify(game));
  io.to(game.code).emit("lyricsUpdated", sentenceData);
};

export const handlePlayerLoss = async (
  reason: "invalidInput" | "timeExpired",
  playerId: string,
  gameCode: string,
  io: Server
) => {
  const game = await getGameFromRedis(gameCode);
  const player = getPlayer(game, playerId);

  player.active = false;
  const activePlayers = Object.values(game.players).filter(
    (player) => player.active
  );
  console.log("active players: " + activePlayers);
  player.rank = activePlayers.length;
  io.to(game.code).emit("updatelosing", player, reason);

  // end of the game
  if (player.rank == 1) {
    game.winnerPlayerName = activePlayers[0].name;
    setTimeout(() => {
      io.to(game.code).emit("gameEnd");
    }, 4000);
  }
};

const getPlayer = (game: GameBase, playerName: string) => {
  return game.players.find((p) => p.name == playerName);
};

export const nextTurn = (game: GameBase) => {
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

const startTurn = (game: GameBase) => {
  const currentPlayerName = game.players[game.currentTurnIndex].name;
  io.to(game.code).emit("startNewTurn", currentPlayerName);
  const TIMER_DURATION = 30 * 1000; // 30 seconds

  if (game.currentTimerId) {
    clearTimeout(game.currentTimerId);
  }

  game.currentTimerId = setTimeout(() => {
    console.log("timerExpired");
    handlePlayerLoss("timeExpired", currentPlayerName, game.code, io);
    if (!game.winnerPlayerName) {
      nextTurn(game);
      startTurn(game);
    }
  }, TIMER_DURATION);
};
