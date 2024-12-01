import React from "react";

import PlayerAvatar from "./PlayerAvatar.tsx";
import { useGameData } from "../../services/queries.ts";
import useUserStore from "../../store/useStore.ts";

// interface PlayerListProps {
//   players: Player[];
//   currentTurn: number;
// }
const PlayerList = () => {
  const { data: game } = useGameData();
  const { userId } = useUserStore((state) => state);

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
          isUserTurn={player.id === userId}
        />
      ))}
    </div>
  );
};

export default PlayerList;
