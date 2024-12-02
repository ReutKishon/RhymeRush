import { useEffect, useState } from "react";

export const useTimer = (
  initialTime: number,
  isUserTurn: boolean,
  onTimeExpired: () => void
): [number, () => void] => {
  const [timer, setTimer] = useState(initialTime);
  const [intervalId, setIntervalId] = useState<number | null>(null);

  useEffect(() => {
    if (timer > 0) {
      const id = setInterval(() => {
        setTimer((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(id);
            if (isUserTurn) {onTimeExpired();}// Trigger when time expires
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      setIntervalId(id);
    }

    return () => {
      if (intervalId) clearInterval(intervalId); // Cleanup on unmount
    };
  }, [timer]);

  const resetTimer = () => {
    if (intervalId) clearInterval(intervalId);
    setTimer(initialTime);
  };

  return [timer, resetTimer];
};
