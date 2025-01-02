import { useEffect } from "react";
import socket from "../services/socket";
import {
  GameBase as Game,
  Player,
  Sentence,
} from "../../../shared/types/gameTypes";
import useStore from "../store/useStore";
import { io } from "socket.io-client";

interface SocketEventsProps {
  setShowResultsModal: (show: boolean) => void;
}
const useSocketEvents = ({ setShowResultsModal }: SocketEventsProps) => {
  const {
    gameCode,
    addPlayer,
    removePlayer,
    addSentence,
    setCurrentPlayerName: setCurrentPlayerId,
    setPlayerAsLoser,
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

    socket.on("updatelosing", (player: Player, reason: string) => {
      console.log("player lost", player);
      setPlayerAsLoser(player.name, player.rank, reason);
    });

    socket.on("lyricsUpdated", (sentence: Sentence) => {
      addSentence(sentence);
    });

    socket.on("UpdateCurrentPlayer", (playerName: string) => {
      console.log("Next turn", playerName);
      setCurrentPlayerId(playerName);
    });

    socket.on("gameEnd", () => {
      console.log("gameEnd");
      setGameIsActive(false);
      setShowResultsModal(true);
    });

    return () => {
      socket.off("gameStarted");
      socket.off("playerJoined");
      socket.off("playerLeft");
      socket.off("lyricsUpdated");
      socket.off("nextTurn");
      socket.off("updatelosing");
    };
  }, [gameCode]);
};

export default useSocketEvents;
