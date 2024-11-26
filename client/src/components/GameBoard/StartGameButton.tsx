import React from "react";
import socket from "../../services/socket.ts";
import axios from "axios";
import { Game } from "../../../../shared/types/gameTypes.ts";
import useUserStore from "../../store/userStore.ts";
import useGameStore from "../../store/gameStore.ts";

const StartGameButton: React.FC = () => {
  const { userId } = useUserStore((state) => state);
  const { gameCreatorId, isGameStarted, gameCode, players, setGameStarted } =
    useGameStore();

  const handleStartGame = () => {
    if (gameCreatorId !== userId || isGameStarted) {
      return;
    }

    const startGame = async () => {
      try {
        const response = await axios.patch(
          `http://localhost:3000/api/v1/game/${gameCode}/start`
        );

        socket.emit("updateTurn", gameCode, players[response.data.startTurn]);
        setGameStarted(true);
      } catch (err) {
        // setError(err.response.data.message);
      }
    };
    startGame();
  };

  return (
    <div>
      <button
        onClick={handleStartGame}
        className="w-30 px-4 py-2 mb-2 bg-green-500 text-white rounded-md"
      >
        Start Game
      </button>
    </div>
  );
};

export default StartGameButton;
