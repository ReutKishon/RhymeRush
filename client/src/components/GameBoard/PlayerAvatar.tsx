import React, { useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import useUserStore from "../../store/useStore";
import { useTimer } from "../../hooks/useTimer.ts";
import { usePlayerLose } from "../../hooks/usePlayerLose.ts";

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
  const { userId, gameCode } = useUserStore((state) => state);

  const handlePlayerLose = usePlayerLose("timeExpired", gameCode, userId);

  const onTimeExpired = () => {
    if (isUserTurn) {
      handlePlayerLose(); // Call the pre-defined handler
    }
  };
  

  const [timer, resetTimer] = useTimer(30, isUserTurn, onTimeExpired);

  useEffect(() => {
    if (showAnimation) {
      resetTimer(); // Reset timer when it's the player's turn
    }
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
      <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm">
        {username}
      </div>
    </div>
  );
};

export default PlayerAvatar;
