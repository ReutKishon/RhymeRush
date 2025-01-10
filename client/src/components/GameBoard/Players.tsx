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
    <div className="flex flex-row md:flex-col justify-center items-center gap-2 md:gap-5 flex-wrap md:flex-nowrap">
      {playerComponents}
    </div>
  );
};

export default Players;
