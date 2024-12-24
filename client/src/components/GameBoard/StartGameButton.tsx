import React from "react";
import { socket, api } from "../../services";
import useAppStore from "../../store/useStore.ts";
import { Button } from "pixel-retroui";

const StartGameButton = () => {
  const { user, game } = useAppStore((state) => state);

  const onStartGamePress = () => {
    if (
      game.isActive ||
      Object.keys(game.players).length === 1 ||
      user.id !== game.gameCreatorId
    ) {
      return;
    }
    socket.emit("startGame");
  };

  return (
    <Button
      bg="#c7f5a4"
      textColor="#30210b"
      borderColor="#30210b"
      shadow="#30210b"
      onClick={onStartGamePress}
      style={{ width: "10%" }}
      className="w-100 py-2 border rounded"
    >
      Start
    </Button>
  );
};

export default StartGameButton;
