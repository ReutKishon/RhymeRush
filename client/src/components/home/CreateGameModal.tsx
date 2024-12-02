import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../../services/socket.ts";
import useUserStore from "../../store/useStore.ts";
import { createGame } from "../../services/api.ts";

const CreateGameModal = () => {
  const { userId } = useUserStore((state) => state);
  const [gameCode, setGameCode] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const createNewGame = async () => {
      try {
        const gameData = await createGame(userId);
        setGameCode(gameData.gameCode);
        socket.emit("createGame", gameData.gameCode, userId);
      } catch (err) {
        console.error("Error creating game:", err);
      }
    };

    createNewGame();
  }, [userId]); // Only run this effect when userId changes

  const handleEnterGame = () => {
    if (!gameCode) {
      return;
    }
    // Navigate to the game room
    navigate(`/game/${gameCode}`);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4">Game Created!</h2>
        <p className="text-gray-700 mb-4">
          Share this game code with others to join:
        </p>
        <div className="mb-4">
          <input
            type="text"
            value={gameCode}
            readOnly
            className="w-full border border-gray-300 rounded px-4 py-2 bg-gray-100"
          />
        </div>
        <button
          onClick={handleEnterGame}
          className="bg-green-500 text-white rounded px-4 py-2 hover:bg-green-600 w-full mb-2"
        >
          Enter Game
        </button>
      </div>
    </div>
  );
};

export default CreateGameModal;
