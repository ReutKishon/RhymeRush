import React from "react";
import { socket, api } from "../../services";
import useAppStore from "../../store/useStore.ts";
import { Button } from "pixel-retroui";

const StartGameButton = () => {
  const {
    user: { username },
    game,
  } = useAppStore((state) => state);

  const onStartGamePress = () => {
    if (
      game.isActive ||
      Object.keys(game.players).length === 1 ||
      username !== game.gameCreatorName
    ) {
      return;
    }
    console.log("onStartGamePress");
    socket.emit("startGame");
  };

  return (
    <Button
      bg="#c7f5a4"
      textColor="#30210b"
      borderColor="#30210b"
      shadow="#30210b"
      onClick={onStartGamePress}
      style={{ fontWeight: "bold", width: "10%" }}
      className="w-20 py-2 border rounded"
    >
      <h1 className="text-xs sm:text-xl text-center">Start</h1>
    </Button>
  );
};

export default StartGameButton;
