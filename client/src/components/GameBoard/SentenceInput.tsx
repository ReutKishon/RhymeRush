import React, { useState, useEffect } from "react";
import socket from "../../services/socket.ts";
import useUserStore from "../../store.ts";
import axios from "axios";
import { Game } from "../../../../shared/types/gameTypes.ts";

interface SentenceInputProps {
  gameCode: string;
}

const SentenceInput: React.FC<SentenceInputProps> = ({ gameCode }) => {
  const [sentence, setSentence] = useState<string>("");
  const [error, setError] = useState<string>("");
  const { userId } = useUserStore((state) => state);

  // Handle sentence change in the input field
  const handleSentenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSentence(e.target.value);
  };

  // Handle the submission of the sentence
  const handleSentenceSubmit = () => {
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
        const gameData: Game = response.data.data.gameData;
        socket.emit("addSentence", gameCode, gameData.lyrics);
        socket.emit("updateTurn", gameCode, gameData.currentTurn);
      } catch (err) {
        setError(err.message);
      }
    };
    addSentence();

    setSentence("");
    setError("");
  };

  return (
    <div className="sentence-input-container">
      <h2 className="text-xl font-bold mb-4">Enter Your Sentence</h2>
      <input
        type="text"
        value={sentence}
        onChange={handleSentenceChange}
        className="w-full border border-gray-300 rounded px-4 py-2 mb-2"
        placeholder="Type your sentence here..."
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        onClick={handleSentenceSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mt-2"
      >
        Submit Sentence
      </button>
    </div>
  );
};

export default SentenceInput;
