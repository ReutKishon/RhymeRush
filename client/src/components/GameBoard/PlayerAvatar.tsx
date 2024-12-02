import React, { useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import useUserStore from "../../store/useStore";
import { useTimer,usePlayerLose } from "../../hooks";
import { Player } from "../../../../shared/types/gameTypes";

interface PlayerProps {
  player: Player;
  isPlayerTurn: boolean;
  gameIsActive: boolean;
}

const PlayerAvatar = ({ player, isPlayerTurn, gameIsActive }: PlayerProps) => {
  const { userId, gameCode } = useUserStore((state) => state);
  const turnStarted = gameIsActive && isPlayerTurn;

  const handlePlayerLose = usePlayerLose(
    "timeExpired",
    gameCode,
    userId,
    player.id === userId
  );

  const onTimeExpired = () => {
    handlePlayerLose();
  };

  const [timer, resetTimer] = useTimer(30, onTimeExpired, turnStarted);

  useEffect(() => {
    if (turnStarted) {
      resetTimer(); // Reset timer when it's the player's turn
    }
  }, [turnStarted]);

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
        turnStarted && timer > 0 ? "shrink-grow-animation" : ""
      }`}
    >
      {turnStarted ? (
        <CircularProgressbar
          value={(timer / 30) * 100}
          styles={buildStyles({
            pathColor: adjustColorTone(player.color, 0.7),
            trailColor: player.color,
            backgroundColor: player.color,
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
          style={{ backgroundColor: player.color }}
        ></div>
      )}
      <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm">
        {player.username}
      </div>
    </div>
  );
};

export default PlayerAvatar;
