import { getGameFromRedis } from "../controllers/gameController";
import redisClient from "../redisClient";
import {
  Player,
  Sentence,
  SentenceScoreData,
} from "../../../shared/types/gameTypes";
import { io } from "../app";
import { Game } from "types/gameTypes";
import { evaluateSentence, generateSentence } from "../utils/openAI";
import { v4 as uuidv4 } from "uuid";

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

  const sentenceId = await addSentenceToSong(game, player, sentence);

  const sentenceScoreData = await getSentenceScores(game, sentence);

  io.to(game.code).emit(
    "updateSentenceScoreData",
    sentenceId,
    sentenceScoreData.generalScore,
    sentenceScoreData.comments
  );

  player.score += sentenceScoreData.generalScore;
  io.to(game.code).emit("updatePlayerScore", playerName, player.score);

  await moveNextTurn(game);

  await redisClient.set(`game:${game.code}`, JSON.stringify(game));
};

const getSentenceScores = async (
  game: Game,
  sentence: string
): Promise<SentenceScoreData> => {
  const res = await evaluateSentence(
    sentence,
    game.lyrics.map((s) => s.content),
    game.topic
  );
  // console.log("res: ", res);
  const responseData = JSON.parse(res.choices[0].message.content);

  const generalScore = responseData.general_score; //Math.floor(Math.random() * 10) + 1;
  const comments = responseData.comments;
  const scoreData: SentenceScoreData = {
    generalScore,
    comments,
  };

  return scoreData;
};

const addSentenceToSong = async (
  game: Game,
  player: Player,
  sentence: string
) => {
  const sentenceId = uuidv4();

  const sentenceData: Sentence = {
    id: sentenceId,
    content: sentence,
    player,
    score: null,
    scoreComments: null,
  };

  game.lyrics.push(sentenceData);
  io.to(game.code).emit("lyricsUpdated", sentenceData);
  return sentenceId;
};

const getPlayer = (game: Game, playerName: string) => {
  return game.players.find((p) => p.name == playerName);
};

export const moveNextTurn = async (game: Game): Promise<void> => {
  game.currentTurnIndex = (game.currentTurnIndex + 1) % game.players.length;
  const currentTurnPlayer = game.players[game.currentTurnIndex];
  io.to(game.code).emit("updateCurrentPlayer", currentTurnPlayer.name);

  startTimer(game);

  if (currentTurnPlayer.name === "AI") {
    setTimeout(async () => {
      const AI_sentence = await generateAIPlayerSentence(game);
      handleAddSentenceSubmit(game.code, "AI", AI_sentence);
    }, 3 * 1000);
  }

  await redisClient.set(`game:${game.code}`, JSON.stringify(game));
};

const generateAIPlayerSentence = async (game: Game): Promise<string> => {
  const res = await generateSentence(
    game.lyrics.map((s) => s.content),
    game.topic
  );
  // console.log("res_sentence: ", res);
  const responseData = JSON.parse(res.choices[0].message.content);
  return responseData.sentence;
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
