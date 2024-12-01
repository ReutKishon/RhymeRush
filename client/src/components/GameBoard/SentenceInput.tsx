import React, { useState } from "react";
import useUserStore from "../../store/useStore.ts";
import socket from "../../services/socket.ts";
import { addSentence } from "../../services/api.ts";
import { Player, Sentence } from "../../../../shared/types/gameTypes.ts";
import { useGameData } from "../../services/queries.ts";

//
const SentenceInput = () => {
  const [sentence, setSentence] = useState<string>("");
  const [error, setError] = useState<string>("");
  const { userId } = useUserStore((state) => state);
  const { data: game } = useGameData();

  const isUserTurn = game?.players[game.currentTurn]?.id === userId;

  const handleSentenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSentence(e.target.value);
  };

  const handleSentenceSubmit = () => {
    if (sentence.trim() === "") {
      setError("Sentence cannot be empty.");
      return;
    }

    if (!isUserTurn) {
      console.log("not userTurn");
      return;
    }
    const addSentenceToLyrics = async () => {
      try {
        await addSentence(game.gameCode, sentence, userId);
        socket.emit("updateGame", game?.gameCode);

        // if (!response.sentenceIsValid) {
        //   if (response.gameData.winner) {
        //     const winner = response.gameData.winner;
        //     socket.emit("gameOver", game.gameCode, winner);
        //   }
        //   socket.emit(
        //     "updateTurn",
        //     game.gameCode,
        //     response.gameData.currentTurn
        //   );

        //   socket.emit("leaveGame", game.gameCode, userId);
        // } else {
        //   const lyrics: Sentence[] = response.gameData.lyrics;
        //   const addedSentence: Sentence = lyrics[lyrics.length - 1];

        //   socket.emit("addSentence", game.gameCode, addedSentence);
        //   socket.emit(
        //     "updateTurn",
        //     game.gameCode,
        //     response.gameData.currentTurn
        //   );

        //   // updatedLyrics(gameCode!, addedSentence);
        // }
      } catch (err) {
        setError(err);
      }
    };
    addSentenceToLyrics();
    setSentence("");
    setError("");
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        value={sentence}
        onChange={handleSentenceChange}
        className="w-full border border-gray-300 rounded px-4 py-2 mb-2"
        placeholder="Type your sentence here"
        disabled={!isUserTurn}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        onClick={handleSentenceSubmit}
        className="w-60 px-4 py-2 mb-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
      >
        Submit Sentence
      </button>
    </div>
  );
};

export default SentenceInput;
