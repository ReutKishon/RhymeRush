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
    <button
      onClick={onStartGamePress}
      className="flex items-center justify-center w-[250px] h-[50px] rounded-full bg-pink-600"
    >
      <h1 className="text-2xl text-green-200 font-bold text-center">Start</h1>
    </button>
  );
};

export default StartGameButton;
