import { useEffect } from "react";
import { removePlayer } from "../services/api";
import socket from "../services/socket";
import useStore from "../store/useStore";

export const usePlayerLose = (
  reason: "timeExpired" | "invalidSentence",
  gameCode: string,
  userId: string
) => {
  const { setIsEliminated, setEliminationReason } = useStore((state) => state);

  return async () => {
    try {
      await removePlayer(gameCode, userId); // Remove player from backend
      setIsEliminated(true); // Update Zustand state
      setEliminationReason(reason); // Track reason for elimination
      socket.emit("updateGame", gameCode); // Notify other players
    } catch (err) {
      console.error("Failed to handle player lose:", err);
    }
  };
};
