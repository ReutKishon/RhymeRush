import { getGameFromRedis } from "../controllers/gameController";
import redisClient from "../redisClient";
import {
  Player,
  Sentence,
  SentenceScores,
} from "../../../shared/types/gameTypes";
import { io } from "../app";
import { Game } from "types/gameTypes";
import { evaluateSentence } from "../utils/sentencValidation";

const timerMap = new Map<string, NodeJS.Timeout>();

export const leaveGame = async (gameCode: string, playerName: string) => {
  const game = await getGameFromRedis(gameCode);

  game.players = game.players.filter((p) => p.name != playerName);
  await redisClient.set(`game:${gameCode}`, JSON.stringify(game));
};

export const startGame = async (gameCode: string) => {
  try {
    const game = await getGameFromRedis(gameCode);
    game.isActive = true;
    setTimeout(async () => {
      clearTimeout(timerMap.get(gameCode));
      io.to(gameCode).emit("gameOver");
      game.isActive = false;
      await redisClient.set(`game:${game.code}`, JSON.stringify(game));
    }, game.timerInMinutes * 60 * 1000);

    startTimer(game);

    await redisClient.set(`game:${game.code}`, JSON.stringify(game));
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

  const sentenceScores = await getSentenceScores(game, sentence);
  player.score += sentenceScores.generalScore;
  io.to(game.code).emit("updatePlayerScore", playerName, player.score);

  await addSentenceToSong(game, player, sentence, sentenceScores);

  await moveNextTurn(game);

  await redisClient.set(`game:${game.code}`, JSON.stringify(game));
};

const getExampleEvaluateSentence = async (
  game: Game,
  sentence: string
): Promise<SentenceScores> => {
  return {
    generalScore: 10,
    rhymeScore: 10,
  };
};

const getSentenceScores = async (
  game: Game,
  sentence: string
): Promise<SentenceScores> => {
  const res = await evaluateSentence(game, sentence);
  const res = await getExampleSentenceScores(game, sentence);
  const assistantResponse = JSON.parse(res.choices[0].message.content);

  // Get the final score
  const finalScore = assistantResponse.finalScore;
  const rhymeScore = assistantResponse.rhymeScore;
  const scores: SentenceScores = {
    generalScore: finalScore,
    rhymeScore: rhymeScore,
  };
  console.log(assistantResponse);
  console.log(finalScore); 

  return scores;
};

const addSentenceToSong = async (
  game: Game,
  player: Player,
  sentence: string,
  scores: SentenceScores
) => {
  const sentenceData: Sentence = {
    content: sentence,
    player,
    scores,
  };

  game.lyrics.push(sentenceData);
  io.to(game.code).emit("lyricsUpdated", sentenceData);
};

const getPlayer = (game: Game, playerName: string) => {
  return game.players.find((p) => p.name == playerName);
};

export const moveNextTurn = async (game: Game): Promise<void> => {
  game.currentTurnIndex = (game.currentTurnIndex + 1) % game.players.length;

  io.to(game.code).emit(
    "updateCurrentPlayer",
    game.players[game.currentTurnIndex].name
  );

  startTimer(game);

  await redisClient.set(`game:${game.code}`, JSON.stringify(game));
};

const startTimer = (game: Game) => {
  // Clear the existing timer for the game code
  const existingTimerId = timerMap.get(game.code);
  if (existingTimerId) {
    clearTimeout(existingTimerId);
  }

  const currPlayer = game.players[game.currentTurnIndex];

  const timerId = setTimeout(async () => {
    currPlayer.score = 0;
    io.to(game.code).emit(
      "updatePlayerScore",
      currPlayer.name,
      currPlayer.score
    );

    await moveNextTurn(game); // Move to the next turn after timeout
  }, 30 * 1000); // 30 seconds

  timerMap.set(game.code, timerId);
};
