import React, { useState } from "react";
import useUserStore from "../../store/userStore.ts";
import useStore from "../../store/useStore.ts";
import socket from "../../services/socket.ts";
import { addSentence } from "../../services/api.ts";
import { Player, Sentence } from "../../../../shared/types/gameTypes.ts";

interface SentenceInputProps {
  isUserTurn: boolean;
}
const SentenceInput: React.FC<SentenceInputProps> = ({ isUserTurn }) => {
  const [sentence, setSentence] = useState<string>("");
  const [error, setError] = useState<string>("");
  const { userId } = useUserStore((state) => state);
  const gameCode = useStore((state) => state.gameCode);

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
        const response = await addSentence(gameCode!, sentence, userId);

        if (!response.sentenceIsValid) {
          if (response.gameData.winner != null) {
            const winner: Player = response.gameData.winner;

            socket.emit("gameOver", gameCode, winner);
          }
          socket.emit("updateTurn", gameCode, response.gameData.currentTurn);

          socket.emit("leaveGame", gameCode, userId);
        } else {
          const lyrics: Sentence[] = response.gameData.lyrics;
          const addedSentence: Sentence = lyrics[lyrics.length - 1];

          socket.emit("addSentence", gameCode, addedSentence);
          socket.emit("updateTurn", gameCode, response.gameData.currentTurn);

          // updatedLyrics(gameCode!, addedSentence);
        }
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
