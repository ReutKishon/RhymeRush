import React from "react";
import { socket, api } from "../../services";
import useAppStore from "../../store/useStore";
import { Button } from "pixel-retroui";

const StartGameButton = () => {
  const {
    user: { username },
    game,
  } = useAppStore((state) => state);

  const onStartGamePress = () => {
    if (
      game.isActive ||
      username !== game.gameCreatorName
    ) {
      return;
    }
    console.log("onStartGamePress");
    console.log("game.isActive", game.isActive);
    console.log("username", username);
    console.log("game.gameCreatorName", game.gameCreatorName);
    socket.emit("startGame")
  };

  return (
    <Button
      bg="#c7f5a4"
      textColor="#30210b"
      borderColor="#30210b"
      shadow="#30210b"
      onClick={onStartGamePress}
      className="w-52 py-2 border rounded"
    >
      <h1 className="text-xs sm:text-xl text-center">Start</h1>
    </Button>
  );
};

export default StartGameButton;
