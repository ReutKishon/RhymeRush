import React, { useMemo } from "react";
import { PlayerAvatar } from "../GameBoard";
import useAppStore from "../../store/useStore";

const PlayerList = () => {
  const { game } = useAppStore((state) => state);

  const getColorById = useMemo(() => {
    const colors = ["#FF5733", "#33FF57", "#3357FF", "#F3FF33", "#FF33A1"];
    return (id: string) => {
      const hash = id
        .split("")
        .reduce((sum, char) => sum + char.charCodeAt(0), 0);
      return colors[hash % colors.length];
    };
  }, []);

  return (
    <div className="flex flex-col space-y-8 p-4">
      {game?.players?.map((player) => (
        <PlayerAvatar
          key={player.id}
          player={player}
          isPlayerTurn={game.currentPlayerId === player.id}
          gameIsActive={game.isActive}
          color={getColorById(player.id)}
        />
      ))}
    </div>
  );
};

export default PlayerList;
