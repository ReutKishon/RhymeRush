import { useEffect } from "react";
import socket from "../services/socket";
import { GameBase as Game } from "../../../shared/types/gameTypes";
import useStore from "../store/useStore";

interface SocketEventsProps {
  gameCode: string;
  setShowGameOverModal: (show: boolean) => void;
  setShowWinningModal: (show: boolean) => void;
  setLoosingReason: (reason: string) => void;
}
const useSocketEvents = ({
  gameCode,
  setShowGameOverModal,
  setLoosingReason,
  setShowWinningModal,
}: SocketEventsProps) => {
  const { setGame, setTimer } = useStore((state) => state);

  useEffect(() => {
    socket.on("gameUpdated", (gameData: Game) => {
      console.log("gameUpdated: ", gameData);
      setGame(gameData);
    });

    socket.on("timerUpdate", (timer: number) => {
      setTimer(timer);
    });

    socket.on("timeExpired", () => {
      setShowGameOverModal(true);
      setLoosingReason("Your time is expired!");
    });

    socket.on("invalidInput", () => {
      setShowGameOverModal(true);
      setLoosingReason("Your sentence is not valid!");
    });

    socket.on("gameEnd", (gameData: Game) => {
      console.log("gameEnd");
      setGame(gameData);
      setShowWinningModal(true);
    });

    return () => {
      socket.off("gameUpdated");
      socket.off("timeExpired");
      socket.off("timerUpdate");
    };
  }, [gameCode]);
};

export default useSocketEvents;
