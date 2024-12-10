import React from "react";
import { socket, api } from "../../services";
import useAppStore from "../../store/useStore.ts";

const StartGameButton = () => {
  const { user, game } = useAppStore((state) => state);

  const onStartGame = () => {
    if (game.isActive || Object.keys(game.players).length === 1) {
      return;
    }
    const handleStartGame = async () => {
      try {
        await api.startGame(game.code);
      } catch (err) {
        console.log(err);
      }
    };
    handleStartGame();
  };

  if (game.gameCreatorId !== user.id) {
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
