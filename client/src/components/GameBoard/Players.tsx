import React, { useMemo } from "react";
import { Player } from "../../../../shared/types/gameTypes";
import PlayerAvatar from "./PlayerAvatar";

interface PlayersProps {
  players: Player[];
  gameIsActive: boolean;
  currentPlayerName: string;
}

const Players = ({
  players,
  gameIsActive,
  currentPlayerName,
}: PlayersProps) => {
  const playerComponents = useMemo(() => {
    
    console.log("players:", players);
    return players.map((player) => {
      return (
        <PlayerAvatar
          key={player.name}
          player={player}
          isPlayerTurn={gameIsActive && currentPlayerName === player.name}
        />
      );
    });
  }, [currentPlayerName, gameIsActive, players]);

  return (
    <div className="flex sm:flex-col gap-5 items-center">
      {playerComponents}
    </div>
  );
};

export default Players;
