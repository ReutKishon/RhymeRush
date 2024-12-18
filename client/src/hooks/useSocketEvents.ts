import { useEffect } from "react";
import socket from "../services/socket";
import { GameBase as Game } from "../../../shared/types/gameTypes";
import useStore from "../store/useStore";

interface SocketEventsProps {
  setShowGameOverModal: (show: boolean) => void;
  setShowWinningModal: (show: boolean) => void;
  setLoosingReason: (reason: string) => void;
}
const useSocketEvents = ({
  setShowGameOverModal,
  setLoosingReason,
  setShowWinningModal,
}: SocketEventsProps) => {
  const { setGame, setTimer, gameCode } = useStore(
    (state) => state
  );

  useEffect(() => {

    socket.on("gameUpdated", (gameData: Game) => {
      if (gameData.winnerPlayerId) {
        console.log("winner: ", gameData.winnerPlayerId);
        setShowWinningModal(true);
        return;
      }
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

    return () => {
      socket.off("gameCreated");
      socket.off("gameUpdated");
      socket.off("timeExpired");
      socket.off("timerUpdate");
      socket.off("invalidInput");
    };
  }, [gameCode]);
};

export default useSocketEvents;
