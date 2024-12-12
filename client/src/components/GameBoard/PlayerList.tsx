import React, { useMemo } from "react";
import { PlayerAvatar } from "../GameBoard";
import useAppStore from "../../store/useStore";

const PlayerList = () => {
  const { game, timer, setTimer } = useAppStore((state) => state);

  const players = useMemo(() => {
    return Object.values(game.players);
  }, [game.players]);

  const playerComponents = useMemo(() => {
    return players.map((player) => {
      const isPlayerTurn =
        game.isActive && game.turnOrder[game.currentTurnIndex] === player.id;

      return (
        <PlayerAvatar
          key={player.id}
          player={player}
          isPlayerTurn={isPlayerTurn}
          timer={isPlayerTurn ? timer : null}
          setTimer={setTimer}
          gameCode={game.code}
        />
      );
    });
  }, [players, game.turnOrder, game.currentTurnIndex, game.isActive, timer]);

  return <div className="flex flex-col space-y-8 p-4">{playerComponents}</div>;
};

export default PlayerList;
