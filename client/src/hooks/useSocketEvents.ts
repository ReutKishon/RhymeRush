import { useEffect } from "react";
import socket from "../services/socket";
import {
  GameBase as Game,
  Player,
  Sentence,
} from "../../../shared/types/gameTypes";
import useStore from "../store/useStore";

interface SocketEventsProps {
  // triggerGameOverModal: (playerName: string, reason: string) => void;
  // triggerGameResultsModal: () => void;
  setShowResultsModal: (show: boolean) => void;
  setLoosingDetails: (
    showLooserModal: boolean,
    playerName: string,
    reason: string
  ) => void;
}
const useSocketEvents = ({
  setShowResultsModal,
  setLoosingDetails,
}: SocketEventsProps) => {
  const {
    setTimer,
    gameCode,
    addPlayer,
    removePlayer,
    addSentence,
    setCurrentPlayerId,
    setPlayerAsLoser,
    setIsActive,
    game,
  } = useStore((state) => state);

  useEffect(() => {
    socket.on("gameStarted", () => {
      setIsActive(true);
    });

    socket.on("playerJoined", (player: Player) => {
      console.log("Player joined", player);
      addPlayer(player);
    });

    socket.on("playerLeft", (playerId: string) => {
      removePlayer(playerId);
    });

    socket.on(
      "updatelosing",
      (reason: string, player: Player) => {
        setPlayerAsLoser(player?.id, player?.rank);
        setLoosingDetails(true, player?.name, reason);
      }
    );

    socket.on("lyricsUpdated", (sentence: Sentence) => {
      addSentence(sentence);
    });

    socket.on("timerUpdate", (timer: number) => {
      setTimer(timer);
    });

    socket.on("nextTurn", (playerId: string) => {
      setCurrentPlayerId(playerId);
    });

    socket.on("gameEnd", () => {
      console.log("gameEnd");
      setShowResultsModal(true);
    });

    return () => {
      socket.off("gameStarted");
      socket.off("playerJoined");
      socket.off("playerLeft");
      socket.off("lyricsUpdated");
      socket.off("nextTurn");
      socket.off("timerUpdate");
      socket.off("updateloosing");
    };
  }, [gameCode]);
};

export default useSocketEvents;
