import React from "react";
import { PlayerAvatar } from "../GameBoard";
import useAppStore from "../../store/useStore";

const PlayerList = () => {
  const { user, game } = useAppStore((state) => state);
  return (
    <div className="flex flex-col space-y-8 p-4">
      {game?.players?.map((player) => (
        <PlayerAvatar
          key={player.id}
          player={player}
          isPlayerTurn={game.currentPlayerId === player.id}
          gameIsActive={game.isActive}
        />
      ))}
    </div>
  );
};

export default PlayerList;
