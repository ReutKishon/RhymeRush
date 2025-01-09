import { useEffect, useState } from "react";
import useAppStore from "../../store/useStore";

const GameTimer = ({}) => {
  const { isActive: gameIsActive, timerInMinutes } = useAppStore(
    (state) => state.game
  );
  const [remainingTime, setRemainingTime] = useState<number>(3 * 60);

  useEffect(() => {
    setRemainingTime(timerInMinutes * 60);
  }, [timerInMinutes]);

  useEffect(() => {
    if (!gameIsActive) return;

    const intervalId = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime <= 1) {
          // Game over logic, stop the timer
          clearInterval(intervalId);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    // Clean up the interval when the component unmounts or when the game is over
    return () => {
      clearInterval(intervalId);
    };
  }, [gameIsActive]);

  // Convert remaining time in seconds to MM:SS format
  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;
  const formattedTime = `${minutes < 10 ? "0" : ""}${minutes}:${
    seconds < 10 ? "0" : ""
  }${seconds}`;
  const progress = (remainingTime / (timerInMinutes * 60)) * 100;

  return (
    <div className="">
      {/* Timer Content */}
      <h1>{formattedTime}</h1>
    </div>
  );
};

export default GameTimer;
