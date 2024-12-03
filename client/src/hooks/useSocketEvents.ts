import { useEffect } from "react";
import socket from "../services/socket";
import { Game } from "../../../shared/types/gameTypes";
import useStore from "../store/useStore";
const useSocketEvents = (gameCode: string) => {
  const { setGame, setEliminationReason, setIsEliminated } = useStore(
    (state) => state
  );
  useEffect(() => {
    socket.on("gameUpdated", (gameData: Game) => {
      console.log("gameUpdated: ", gameData);
      setEliminationReason("");
      setIsEliminated(false);
      setGame(gameData);
    });

    return () => {
      socket.off("gameUpdated");
    };
  }, [gameCode]);
};

export default useSocketEvents;
