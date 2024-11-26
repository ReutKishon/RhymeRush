import React from "react";
import socket from "../../services/socket.ts";
import useUserStore from "../../store.ts";
import axios from "axios";
import { Game } from "../../../../shared/types/gameTypes.ts";

interface StartGameButtonProps {
  gameData: Game;
}

const StartGameButton: React.FC<StartGameButtonProps> = ({ gameData }) => {
  const { userId } = useUserStore((state) => state);

  const handleStartGame = () => {
    if (gameData.gameCreatorId !== userId || gameData.isStarted) {
      return;
    }

    const startGame = async () => {
      try {
        const response = await axios.patch(
          `http://localhost:3000/api/v1/game/${gameData.gameCode}/start`
        );

        socket.emit(
          "updateTurn",
          gameData.gameCode,
          gameData.players[response.data.startTurn]
        );
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
