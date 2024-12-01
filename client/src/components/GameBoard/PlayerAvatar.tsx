import React, { useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import useUserStore from "../../store/useStore";
import { userTurnExpired } from "../../services/api";
import socket from "../../services/socket.ts";

interface PlayerProps {
  username: string;
  playerColor: string;
  showAnimation: boolean;
  isUserTurn: boolean;
}

const PlayerAvatar = ({
  username,
  playerColor,
  showAnimation,
  isUserTurn,
}: PlayerProps) => {
  const [timer, setTimer] = useState<number>(30); // 30-second timer
  const [intervalId, setIntervalId] = useState<number | null>(null);
  const { gameCode, userId } = useUserStore((state) => state);

  // currentTurn?.id === player.id
  useEffect(() => {
    if (showAnimation) {
      setTimer(30); // Reset timer when it's this player's turn

      const newIntervalId = setInterval(() => {
        setTimer((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(newIntervalId); // Stop the timer when it reaches 0
            if (isUserTurn) {
              userTurnExpired(gameCode, userId);
              socket.emit("updateGame", gameCode);
            }
            return 0;
          }
          return prevTime - 1; // Decrement timer
        });
      }, 1000);

      setIntervalId(newIntervalId);
    } else {
      // If it's not this player's turn, stop the timer
      if (intervalId) {
        clearInterval(intervalId);
      }
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId); // Cleanup timer on unmount
      }
    };
  }, [showAnimation]);

  const adjustColorTone = (color: string, factor: number): string => {
    const hex = color.replace("#", "");
    const rgb = hex.match(/.{1,2}/g)?.map((value) => parseInt(value, 16)) ?? [];
    const adjustedRgb = rgb.map((channel) =>
      Math.min(255, Math.max(0, Math.floor(channel * factor)))
    );
    return `rgb(${adjustedRgb.join(",")})`;
  };

  return (
    <div
      className={`relative w-28 h-28 transition-all duration-1000 ${
        showAnimation && timer > 0 ? "shrink-grow-animation" : ""
      }`}
    >
      {showAnimation ? (
        <CircularProgressbar
          value={(timer / 30) * 100}
          styles={buildStyles({
            pathColor: adjustColorTone(playerColor, 0.7),
            trailColor: playerColor,
            backgroundColor: playerColor,
            strokeLinecap: "round",
            textColor: "white",
            textSize: "0px",
          })}
          background // Enables the filled background effect
          backgroundPadding={5}
        />
      ) : (
        // Static Circle for non-current players
        <div
          className="w-full h-full rounded-full"
          style={{ backgroundColor: playerColor }}
        ></div>
      )}
      {/* Username Overlay (common for both cases) */}
      <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm">
        {username}
      </div>
    </div>
  );
};

export default PlayerAvatar;

// if (prevTime === 0) {
//   setIsGameOver(true);
// }
