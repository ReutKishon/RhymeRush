import React from "react";
import {socket,api} from "../../services";
import useStore from "../../store/useStore.ts";
import {useGameData} from "../../hooks";

const StartGameButton = () => {
  const { userId } = useStore((state) => state);
  const { data: game } = useGameData();
  
  const onStartGame = () => {
    if (game?.isActive || game?.players.length === 1) {
      return;
    }
    const handleStartGame = async () => {
      try {
        await api.startGame(game?.gameCode!);
        socket.emit("updateGame", game?.gameCode);
      } catch (err) {
        console.log(err);
      }
    };
    handleStartGame();
  };

  if (game?.gameCreatorId !== userId) {
    return null;
  }

  return (
    <div>
      <button
        onClick={onStartGame}
        className="w-30 px-4 py-2 mb-2 bg-green-500 text-white rounded-md"
      >
        Start Game
      </button>
    </div>
  );
};

export default StartGameButton;
