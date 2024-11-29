import React, { useEffect, useState } from "react";
import useUserStore from "../../store/userStore.ts";
import useStore from "../../store/useStore.ts";
import socket from "../../services/socket.ts";
import { useQueryClient } from "react-query";
import { addSentence } from "../../services/api.ts";
import { Game, Sentence } from "../../../../shared/types/gameTypes.ts";

const SentenceInput: React.FC<{ isUserTurn: boolean }> = ({ isUserTurn }) => {
  const [sentence, setSentence] = useState<string>("");
  const [error, setError] = useState<string>("");
  const { userId } = useUserStore((state) => state);
  const gameCode = useStore((state) => state.gameCode);
  const queryClient = useQueryClient();

  const handleSentenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSentence(e.target.value);
  };

  const handleSentenceSubmit = async () => {
    if (sentence.trim() === "") {
      setError("Sentence cannot be empty.");
      return;
    }
    try {
      const response = await addSentence(gameCode!, sentence, userId);

      if (!response.sentenceIsValid) {
        socket.emit("leaveGame", gameCode, userId);
      } else {
        const addedSentence: Sentence = response.gameData.lyrics[-1]!;
        console.log("HIIII",addedSentence);
        socket.emit("addSentence", gameCode, addedSentence);
      }

      socket.emit("updateTurn", gameCode, response.gameData.currentTurn);
    } catch (err) {
      setError(err);
    }
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
