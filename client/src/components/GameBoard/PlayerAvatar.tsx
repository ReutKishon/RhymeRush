import React, { useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { Player } from "../../../../shared/types/gameTypes";
import { Box, Typography } from "@mui/material";

interface PlayerProps {
  player: Player;
  isPlayerTurn: boolean;
}

const PlayerAvatar = ({ player, isPlayerTurn }: PlayerProps) => {
  const [timer, setTimer] = useState<number | null>(null);

  useEffect(() => {
    let intervalId: number | null = null;

    if (isPlayerTurn) {
      setTimer(30);

      intervalId = setInterval(() => {
        setTimer((prev) => {
          if (prev && prev > 0) {
            return prev - 1;
          } else {
            clearInterval(intervalId!);
            return null;
          }
        });
      }, 1000);
    } else {
      setTimer(null);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isPlayerTurn]);

  return (
    <div
      className={`relative w-[70px] h-[70px] sm:w-[112px] sm:h-[112px] transition-all duration-1000 ${
        isPlayerTurn ? "transform scale-110" : ""
      } ${!player.active ? "opacity-70" : ""}`}
    >
      {timer ? (
        <CircularProgressbar
          value={(timer / 30) * 100}
          styles={buildStyles({
            pathColor: "white",
            trailColor: player.color,
            backgroundColor: player.color,
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
            backgroundColor: player.color,
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
        <Typography color="white">{player.name}</Typography>
      </Box>
    </div>
  );
};

export default React.memo(PlayerAvatar);
