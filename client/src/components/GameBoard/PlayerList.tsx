import React, { useMemo } from "react";
import { PlayerAvatar } from "../GameBoard";
import useAppStore from "../../store/useStore";

const PlayerList = () => {
  const players = useAppStore((state) => state.game.players);
  const gameIsActive = useAppStore((state) => state.game.isActive);
  const currentPlayerName = useAppStore(
    (state) => state.game.currentPlayerName
  );
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
