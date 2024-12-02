import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "../../../store/useStore";
import { useGameData } from "../../../hooks";

const GameEndModal = () => {
  const { data: game } = useGameData();
  const { userId, isEliminated, eliminationReason } = useUserStore(
    (state) => state
  );
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!isEliminated && !game?.winner) {
      return;
    }
    if (isEliminated || game?.winner?.id !== userId) {
      console.log(isEliminated, game?.winner?.id, userId);
      setTitle("You Lose the Game!");
      setContent(eliminationReason);
    } else {
      setTitle("You are the Winner!");
      setContent("");
    }
  }, [isEliminated, game?.winner, eliminationReason, userId]);

  if (!isEliminated && !game?.winner) {
    return null;
  }

  const handleSaveSong = () => {
    // Save the game and song data to the database
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-8 relative text-center">
        {/* Close Button */}
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={() => navigate("/home")}
          aria-label="Close Modal"
        >
          X
        </button>

        {/* Modal Content */}
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <h1 className="text-2xl font-bold mb-4">{content}</h1>

        <button
          onClick={handleSaveSong}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Save Song
        </button>
      </div>
    </div>
  );
};

export default GameEndModal;
