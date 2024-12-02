import React, { useEffect, useState } from "react";

import PlayerAvatar from "./PlayerAvatar.tsx";
import useGameData from "../../hooks/useGameData.ts";

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
