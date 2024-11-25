import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../../services/socket.ts";
import useUserStore from "../../store.ts";
import { Player } from "../../../../shared/types/gameTypes.ts";

const JoinGameModal: React.FC = () => {
  const [gameCode, setGameCode] = useState("");
  const { userId } = useUserStore((state) => state);
  const navigate = useNavigate();

  const handleEnterGame = () => {
    if (gameCode.trim() === "") {
      return;
    }
    const joinPlayer = async () => {
      try {
        const response = await axios.patch(
          `http://localhost:3000/api/v1/game/${gameCode}/${userId}`
        );
        // console.log("response: ", response);
        const joinedPlayer: Player = response.data.joinedPlayer;
        socket.emit("joinGame", gameCode, joinedPlayer);
        navigate(`/game/${gameCode}`);
      } catch (err) {
        console.log(err);
      }
    };
    joinPlayer();
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
