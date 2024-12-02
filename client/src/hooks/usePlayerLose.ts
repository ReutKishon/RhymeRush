import { socket, api } from "../services";
import useStore from "../store/useStore";

const usePlayerLose = (
  reason: "timeExpired" | "invalidSentence",
  gameCode: string,
  userId: string,
  isUserTurn: boolean
) => {
  const { setIsEliminated, setEliminationReason } = useStore((state) => state);

  return async () => {
    if (isUserTurn) {
      try {
        await api.removePlayer(gameCode, userId);
        setIsEliminated(true);
        setEliminationReason(reason);
        socket.emit("updateGame", gameCode); // Notify other players
      } catch (err) {
        console.error("Failed to handle player lose:", err);
      }
    }
  };
};

export default usePlayerLose;
