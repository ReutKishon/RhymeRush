import React from "react";
import { PlayerAvatar } from "../GameBoard";
import { useGameData } from "../../hooks";

const PlayerList = () => {
  const { data: game } = useGameData();
  return (
    <div className="flex flex-col space-y-8 p-4">
      {game?.players.map((player) => (
        <PlayerAvatar
          key={player.id}
          player={player}
          isPlayerTurn={game.players[game.currentTurn]?.id === player.id}
          gameIsActive={game.isActive}
        />
      ))}
    </div>
  );
};

export default PlayerList;
