import React, { useMemo } from "react";
import { PlayerAvatar } from "../GameBoard";
import useAppStore from "../../store/useStore";

const PlayerList = () => {
  const {
    players,
    isActive: gameIsActive,
    currentPlayerName,
  } = useAppStore((state) => state.game);

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
    <div className="flex sm:flex-col justify-center items-center gap-4">
      {playerComponents}
    </div>
  );
};

export default PlayerList;
