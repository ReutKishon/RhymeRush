import React, { useMemo } from "react";
import { PlayerAvatar } from "../GameBoard";
import useAppStore from "../../store/useStore";
import { Box } from "@mui/material";

const PlayerList = () => {
  const { timer, setTimer } = useAppStore((state) => state);
  const players = useAppStore((state) => state.game.players);
  const gameIsActive = useAppStore((state) => state.game.isActive);
  const currentPlayerId = useAppStore((state) => state.game.currentPlayerId);
  // console.log("players: ", players);
  const playerComponents = useMemo(() => {
    return players.map((player) => {
      const isPlayerTurn = gameIsActive && currentPlayerId === player.id;

      return (
        <PlayerAvatar
          key={player.id}
          player={player}
          isPlayerTurn={isPlayerTurn}
          timer={isPlayerTurn ? timer : null}
          setTimer={setTimer}
        />
      );
    });
  }, [gameIsActive, timer, players]);

  return (
    <div className="flex sm:flex-col justify-center items-center gap-4">
      {playerComponents}
    </div>
  );
};

export default PlayerList;
