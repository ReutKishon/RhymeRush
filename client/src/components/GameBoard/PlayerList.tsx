import React, { useEffect } from "react";

import PlayerAvatar from "./PlayerAvatar.tsx";

import { useGameData } from "../../services/queries.ts";
import { Player } from "../../../../shared/types/gameTypes.ts";

interface PlayerListProps {
  players: Player[];
  currentTurn: number;
}
const PlayerList: React.FC<PlayerListProps> = ({ players, currentTurn }) => {
  if (players === undefined) {
    return null;
  }
  return (
    <div className="flex flex-col space-y-8 p-4">
      {players.map((player, index) => (
        <PlayerAvatar
          key={index}
          username={player.username}
          playerColor={player.color}
          showAnimation={players[currentTurn]?.id === player.id}
        />
      ))}
    </div>
  );
};

export default PlayerList;
