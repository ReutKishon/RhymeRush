import React, { useState } from "react";
import useAppStore from "../../store/useStore.ts";
import socket from "../../services/socket.ts";
import { api } from "../../services";
import { usePlayerLose } from "../../hooks";

const SentenceInput = () => {
  const [sentence, setSentence] = useState<string>("");
  const [error, setError] = useState<string>("");
  const { user, game } = useAppStore((state) => state);

  const isUserTurn = game?.isActive && game.currentPlayerId === user.id;

  const handlePlayerLose = usePlayerLose(
    "invalidSentence",
    game?.code!,
    user.id,
    isUserTurn
  );

  const handleSentenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSentence(e.target.value);
  };

  const handleSentenceSubmit = () => {
    if (!isUserTurn) {
      return;
    }

    if (sentence.trim() === "") {
      setError("Sentence cannot be empty.");
      return;
    }

    const addSentenceToLyrics = async () => {
      try {
        const sentenceIsValid = await api.submitSentence(
          game.code,
          user.id,
          sentence
        );
        if (!sentenceIsValid) {
          handlePlayerLose();
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
        disabled={!game.isActive || !isUserTurn}
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
