import { useEffect } from "react";
import socket from "../services/socket";
import { GameBase as Game, PlayerBase } from "../../../shared/types/gameTypes";
import useStore from "../store/useStore";

interface SocketEventsProps {
  // setShowGameOverModal: (show: boolean) => void;
  // setShowWinningModal: (show: boolean) => void;
  // setGameOverContent: (reason: string) => void;
  triggerGameOverModal: (playerName: string, reason: string) => void;
}
const useSocketEvents = ({
  triggerGameOverModal
}: SocketEventsProps) => {
  const { setGame, setTimer, gameCode } = useStore((state) => state);

  useEffect(() => {
    socket.on("gameUpdated", (gameData: Game) => {
      // if (gameData.winnerPlayerId) {
      //   console.log("winner: ", gameData.winnerPlayerId);
      //   setShowWinningModal(true);
      //   return;
      // }
      console.log("gameUpdated: ", gameData);
      setGame(gameData);
    });

    socket.on("timerUpdate", (timer: number) => {
      setTimer(timer);
    });

    socket.on("timeExpired", (playerName: string) => {
      triggerGameOverModal(playerName, "Time expired");
    });

    socket.on("invalidInput", (playerName: string) => {
      triggerGameOverModal(playerName, "Invalid sentence");
    });

    return () => {
      socket.off("gameUpdated");
      socket.off("timeExpired");
      socket.off("timerUpdate");
      socket.off("invalidInput");
    };
  }, [gameCode]);
};

export default useSocketEvents;
