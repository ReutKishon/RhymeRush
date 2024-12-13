import React from "react";
import { socket, api } from "../../services";
import useAppStore from "../../store/useStore.ts";
import { Button } from "@mui/material";

const StartGameButton = () => {
  const { user, game } = useAppStore((state) => state);
  console.log("StartGameButton");

  const onStartGame = () => {
    if (
      game.isActive ||
      Object.keys(game.players).length === 1 ||
      user.id !== game.gameCreatorId
    ) {
      return;
    }
    const handleStartGame = async () => {
      try {
        await api.startGame(game.code);
      } catch (err) {
        console.log(err);
      }
    };
    handleStartGame();
  };

  return (
    <Button
      onClick={onStartGame}
      sx={{
        width: "8%",
        height: "10%",
        padding: 2,
        backgroundColor: "#ffcccc",
        color: "white",
        borderRadius: 1,
        "&:hover": {
          backgroundColor: "#ffcccc",
        },
      }}
    >
      Start
    </Button>
  );
};

export default StartGameButton;
