import React, { useMemo } from "react";
import { PlayerAvatar } from "../GameBoard";
import useAppStore from "../../store/useStore";
import { Box } from "@mui/material";

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
        />
      );
    });
  }, [players, game.turnOrder, game.currentTurnIndex, game.isActive, timer]);

  return (
    <Box
      sx={{
        width: "20%",
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
      }}
    >
      {playerComponents}
    </Box>
  );
};

export default PlayerList;
