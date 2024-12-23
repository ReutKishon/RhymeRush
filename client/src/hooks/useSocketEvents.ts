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
}
const useSocketEvents = ({ setShowResultsModal }: SocketEventsProps) => {
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

    socket.on("lyricsUpdated", (sentence: Sentence) => {
      addSentence(sentence);
    });

    socket.on("timerUpdate", (timer: number) => {
      setTimer(timer);
    });

    socket.on("nextTurn", (playerId: string) => {
      setCurrentPlayerId(playerId);
    });

    socket.on("timeExpired", (player: Player) => {
      setPlayerAsLoser(player.id, player.rank);
      // triggerGameOverModal(playerName, "Time expired");
    });

    socket.on("invalidInput", (player: Player) => {
      setPlayerAsLoser(player.id, player.rank);
      // triggerGameOverModal(playerName, "Invalid sentence");
    });

    return () => {
      socket.off("gameStarted");
      socket.off("playerJoined");
      socket.off("playerLeft");
      socket.off("lyricsUpdated");
      socket.off("nextTurn");
      socket.off("timeExpired");
      socket.off("timerUpdate");
      socket.off("invalidInput");
    };
  }, [gameCode]);
};

export default useSocketEvents;
