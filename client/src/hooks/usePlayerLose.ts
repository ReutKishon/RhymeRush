import { useEffect } from "react";
import { removePlayer } from "../services/api";
import socket from "../services/socket";
import useStore from "../store/useStore";

export const usePlayerLose = (
  reason: "timeExpired" | "invalidSentence",
  gameCode: string,
  userId: string,
  isUserTurn: boolean
) => {
  const { setIsEliminated, setEliminationReason } = useStore((state) => state);

  return async () => {
    if (isUserTurn) {
      console.log("isUserTurn: " + isUserTurn);
      try {
        await removePlayer(gameCode, userId);
        setIsEliminated(true);
        setEliminationReason(reason);
        socket.emit("updateGame", gameCode); // Notify other players
      } catch (err) {
        console.error("Failed to handle player lose:", err);
      }
    }
  };
};
