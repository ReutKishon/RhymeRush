import React, { useState, useEffect } from "react";
import socket from "../../services/socket.ts";
import useUserStore from "../../store.ts";
import axios from "axios";
import { Game } from "../../../../shared/types/gameTypes.ts";

interface SentenceInputProps {
  gameCode: string;
  isPlayerTurn: boolean;
  setIsGameOver:React.Dispatch<React.SetStateAction<boolean>>
}

const SentenceInput: React.FC<SentenceInputProps> = ({
  gameCode,
  isPlayerTurn,
  setIsGameOver
}) => {
  const [sentence, setSentence] = useState<string>("");
  const [error, setError] = useState<string>("");
  const { userId } = useUserStore((state) => state);

  // Handle sentence change in the input field
  const handleSentenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSentence(e.target.value);
  };

  // Handle the submission of the sentence
  const handleSentenceSubmit = () => {
    if (!isPlayerTurn) return;
    if (sentence.trim() === "") {
      setError("Sentence cannot be empty.");
      return;
    }
    const addSentence = async () => {
      try {
        const response = await axios.post(
          `http://localhost:3000/api/v1/game/${gameCode}/${userId}/sentence`,
          { sentence }
        );

        if (!response.data.data.sentenceIsValid) {
          setError("Invalid sentence."); //TODO: open a modal for loosing the game
          socket.emit("leaveGame", gameCode, userId);
          setIsGameOver(true)
          return;
        }

        const gameData: Game = response.data.data.gameData;
        socket.emit("addSentence", gameCode, gameData.lyrics);
        socket.emit(
          "updateTurn",
          gameCode,
          gameData.players[gameData.currentTurn]
        );
      } catch (err) {
        setError(err.response.data.message);
      }
    };
    addSentence();
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
        disabled={!isPlayerTurn}
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
