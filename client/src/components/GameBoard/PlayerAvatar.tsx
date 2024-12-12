import React, { useEffect, useMemo } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { PlayerBase } from "../../../../shared/types/gameTypes";
import { socket } from "../../services";
import { adjustColorTone, getColorById } from "../../utils/colorGenerator";
import useAppStore from "../../store/useStore";

interface PlayerProps {
  player: PlayerBase;
  isPlayerTurn: boolean;
  timer: number | null;
  setTimer: (timer: number) => void;
  gameCode: string;
}

const PlayerAvatar = ({
  player,
  isPlayerTurn,
  timer,
  setTimer,
  gameCode
}: PlayerProps) => {
  console.log(`PlayerAvatar rendered for player: ${player.name}`);


  const avatarColor = useMemo(() => getColorById(player.id), [player.id]);

  useEffect(() => {
    if (isPlayerTurn) {
      setTimer(30); // Reset the timer to 30 for the current player
      socket.emit("startTurn", player.id, gameCode);
    }
  }, [isPlayerTurn, player.id, setTimer]);

  return (
    <div
      className={`relative w-28 h-28 transition-all duration-1000 ${
        timer && timer > 0 ? "shrink-grow-animation" : ""
      }`}
    >
      {timer ? (
        <CircularProgressbar
          value={(timer / 30) * 100}
          styles={buildStyles({
            pathColor: adjustColorTone(avatarColor, 0.7),
            trailColor: avatarColor,
            backgroundColor: avatarColor,
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
          style={{ backgroundColor: avatarColor }}
        ></div>
      )}
      <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm">
        {player.name}
      </div>
    </div>
  );
};

export default React.memo(PlayerAvatar);
