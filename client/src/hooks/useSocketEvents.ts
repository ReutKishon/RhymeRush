import { useEffect } from "react";
import socket from "../services/socket";
import {
  GameBase as Game,
  Player,
  Sentence,
} from "../../../shared/types/gameTypes";
import useStore from "../store/useStore";

interface SocketEventsProps {
  setShowResultsModal: (show: boolean) => void;
}
const useSocketEvents = ({ setShowResultsModal }: SocketEventsProps) => {
  const {
    game: { code },
    addPlayer,
    removePlayer,
    addSentence,
    setCurrentPlayerName: setCurrentPlayerId,
    setPlayerScore,
    setGameIsActive,
  } = useStore((state) => state);

  useEffect(() => {
    socket.on("gameStarted", () => {
      setGameIsActive(true);
    });

    socket.on("playerJoined", (player: Player) => {
      console.log("Player joined", player);
      addPlayer(player);
    });

    socket.on("playerLeft", (playerId: string) => {
      removePlayer(playerId);
    });

    socket.on("updatePlayerScore", (playerName: string, score: number) => {
      setPlayerScore(playerName, score);
    });

    socket.on("lyricsUpdated", (sentence: Sentence) => {
      addSentence(sentence);
    });

    socket.on("updateCurrentPlayer", (playerName: string) => {
      console.log("Next turn", playerName);
      setCurrentPlayerId(playerName);
    });

    socket.on("gameOver", () => {
      console.log("gameOver");
      setGameIsActive(false);
      setShowResultsModal(true);
    });

    return () => {
      socket.off("gameStarted");
      socket.off("playerJoined");
      socket.off("playerLeft");
      socket.off("lyricsUpdated");
      socket.off("nextTurn");
      socket.off("updatePlayerScore");
      socket.off("UpdateCurrentPlayer");
    };
  }, [code]);
};

export default useSocketEvents;
