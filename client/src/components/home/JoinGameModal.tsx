import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { socket, api } from "../../services";
import useStore from "../../store/useStore.ts";

const JoinGameModal = () => {
  const [gameCode, setGameCode] = useState("");
  const { userId } = useStore((state) => state);
  const navigate = useNavigate();

  const handleEnterGame = async () => {
    if (gameCode.trim() === "") {
      return;
    }
    try {
      const joinedPlayer = await api.addPlayer(gameCode!, userId);

      socket.emit("joinGame", gameCode, joinedPlayer);
      navigate(`/game/${gameCode}`);
    } catch (err) {
      console.log(err);
    }
  };

  const handleGameCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGameCode(event.target.value); // Update gameCode state when the input changes
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4">Join A Game</h2>
        <div className="mb-4">
          <input
            type="text"
            value={gameCode}
            onChange={handleGameCodeChange}
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

export default JoinGameModal;
