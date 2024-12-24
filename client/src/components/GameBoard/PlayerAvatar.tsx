import React, { useEffect, useMemo } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { Player } from "../../../../shared/types/gameTypes";
import { socket } from "../../services";
import { adjustColorTone, getColorById } from "../../utils/colorGenerator";
import { Box, Typography } from "@mui/material";
import useAppStore from "../../store/useStore";

interface PlayerProps {
  player: Player;
  isPlayerTurn: boolean;
  timer: number | null;
  setTimer: (timer: number) => void;
}

const PlayerAvatar = ({
  player,
  isPlayerTurn,
  timer,
  setTimer,
}: PlayerProps) => {
  const { gameCode } = useAppStore((state) => state);

  const avatarColor = useMemo(() => getColorById(player.id), [player.id]);

  useEffect(() => {
    if (isPlayerTurn) {
      console.log(`PlayerAvatar rendered for player: ${player.name}`);

      setTimer(30); // Reset the timer to 30 for the current player
      socket.emit("startTimer", gameCode, player.id);
    }
  }, [isPlayerTurn, player.id, setTimer]);

  return (
    <div
      className={`relative w-[70px] h-[70px] sm:w-[112px] sm:h-[112px] transition-all duration-1000 ${
        isPlayerTurn ? "transform scale-110" : ""
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
          background
          backgroundPadding={5}
        />
      ) : (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            backgroundColor: avatarColor,
          }}
        />
      )}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          color: "white",
          fontWeight: "bold",
          fontSize: "14px", // Equivalent to text-sm in Tailwind
        }}
      >
        <Typography>{player.name}</Typography>
      </Box>
    </div>
  );
};

export default React.memo(PlayerAvatar);
