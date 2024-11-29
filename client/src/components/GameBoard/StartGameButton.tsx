import React from "react";
import socket from "../../services/socket.ts";
import axios from "axios";
import { Game } from "../../../../shared/types/gameTypes.ts";
import useUserStore from "../../store/userStore.ts";
import useGameStore from "../../store/useStore.ts";

interface StartGameButtonProps {
  gameCreatorId: string;
  isStarted: boolean;
}
const StartGameButton: React.FC<StartGameButtonProps> = ({
  gameCreatorId,
  isStarted,
}) => {
  const { userId } = useUserStore((state) => state);
  const { gameCode } = useGameStore();
  console.log(gameCreatorId, isStarted,userId);

  const handleStartGame = () => {
    if (gameCreatorId !== userId || isStarted) {
      return;
    }

    const startGame = async () => {
      try {
        const response = await axios.patch(
          `http://localhost:3000/api/v1/game/${gameCode}/start`
        );
        socket.emit("updateTurn", gameCode, response.data.data.startTurn);
      } catch (err) {
        console.log(err);
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
