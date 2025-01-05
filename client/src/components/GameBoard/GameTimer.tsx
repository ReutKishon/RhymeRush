import { useEffect, useState } from "react";
import useAppStore from "../../store/useStore";
import React from "react";

const GameTimer = ({ setShowResultsModal }) => {
  const [remainingTime, setRemainingTime] = useState<number>(3 * 60);
  const { isActive: gameIsActive } = useAppStore((state) => state.game);

  useEffect(() => {
    if (!gameIsActive) return;

    const intervalId = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime <= 1) {
          // Game over logic, stop the timer
          clearInterval(intervalId);
          setShowResultsModal(true);
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

  return (
    <div
      style={{
        width: "100px",
        height: "100px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        border: "2px solid #000", // Square border style
        borderRadius: "8px", // Optional: gives the square a rounded corner
        backgroundColor: "#f0f0f0", // Background color for the timer
        fontSize: "20px", // Font size for timer text
        fontWeight: "bold", // Makes the text bold
        color: "#333", // Text color
      }}
    >
      <p>{formattedTime}</p>
    </div>
  );
};

export default GameTimer;
