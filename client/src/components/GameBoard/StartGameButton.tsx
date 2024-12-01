import React from "react";
import socket from "../../services/socket.ts";
import axios from "axios";
import { Game } from "../../../../shared/types/gameTypes.ts";

import { useGameData } from "../../services/queries.ts";
import useStore from "../../store/useStore.ts";

const StartGameButton = () => {
  const { userId } = useStore((state) => state);
  const { data: game } = useGameData();

  const handleStartGame = () => {
    if (game?.isActive || game?.players.length === 1) {
      console.log("handleStartGame: ", game);
      return;
    }

    const startGame = async () => {
      try {
        await axios.patch(
          `http://localhost:3000/api/v1/game/${game?.gameCode}/start`
        );
        socket.emit("updateGame", game?.gameCode);
      } catch (err) {
        console.log(err);
      }
    };
    startGame();
  };

  if (game?.gameCreatorId !== userId) {
    return null;
  }

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
