import { useEffect, useState } from "react";

export const useTimer = (
  initialTime: number,
  onTimeExpired: () => void,
  turnStarted: boolean
): [number, () => void] => {
  const [timer, setTimer] = useState(initialTime);
  const [intervalId, setIntervalId] = useState<number | null>(null);

  useEffect(() => {
    if (turnStarted && timer > 0) {
      const id = setInterval(() => {
        setTimer((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(id);
            onTimeExpired(); // Trigger when time expires
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
  }, [timer, turnStarted]);

  const resetTimer = () => {
    if (intervalId) clearInterval(intervalId);
    setTimer(initialTime);
  };

  return [timer, resetTimer];
};
