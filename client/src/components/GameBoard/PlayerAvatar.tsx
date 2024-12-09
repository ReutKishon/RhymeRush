import React, { useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import useAppStore from "../../store/useStore";
import { useTimer, usePlayerLose } from "../../hooks";
import { Player } from "../../../../shared/types/gameTypes";
import { socket } from "../../services";

interface PlayerProps {
  player: Player;
  isPlayerTurn: boolean;
  gameIsActive: boolean;
  color: string;
}

const PlayerAvatar = ({
  player,
  isPlayerTurn,
  gameIsActive,
  color,
}: PlayerProps) => {
  const { user, game, timer } = useAppStore((state) => state);
  const turnStarted = gameIsActive && isPlayerTurn;

  const handlePlayerLose = usePlayerLose(
    "timeExpired",
    game.code,
    user.id,
    player.id === user.id
  );

  const onTimeExpired = () => {
    handlePlayerLose();
  };

  // const [timer, resetTimer] = useTimer(30, onTimeExpired, turnStarted);

  useEffect(() => {
    if (turnStarted) {
      socket.emit("startTurn", player.id); // Notify other players
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
            pathColor: adjustColorTone(color, 0.7),
            trailColor: color,
            backgroundColor: color,
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
          style={{ backgroundColor: color }}
        ></div>
      )}
      <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm">
        {player.name}
      </div>
    </div>
  );
};

export default PlayerAvatar;
