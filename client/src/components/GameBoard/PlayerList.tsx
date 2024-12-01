import React, { useEffect } from "react";

import PlayerAvatar from "./PlayerAvatar.tsx";
import { useGameData } from "../../services/queries.ts";

// interface PlayerListProps {
//   players: Player[];
//   currentTurn: number;
// }
const PlayerList = () => {
  const { data: game } = useGameData();

  return (
    <div className="flex flex-col space-y-8 p-4">
      {game?.players.map((player, index) => (
        <PlayerAvatar
          key={index}
          username={player.username}
          playerColor={player.color}
          showAnimation={
            game?.isActive && game.players[game.currentTurn]?.id === player.id
          }
        />
      ))}
    </div>
  );
};

export default PlayerList;
