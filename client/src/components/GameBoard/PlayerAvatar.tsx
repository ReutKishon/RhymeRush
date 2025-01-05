import React, { useEffect, useState } from "react";
import { Player } from "../../../../shared/types/gameTypes";
import { Box, CircularProgress, Typography, SvgIcon } from "@mui/material";

const CoinIcon = () => (
  <SvgIcon
    sx={{ color: "yellow" }}
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path fill="currentColor" />
  </SvgIcon>
);

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
    <Box
      sx={{
        position: "relative",
        width: "112px",
        height: "112px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        animation: isPlayerTurn
          ? "growShrink 1.5s infinite ease-in-out"
          : "none",
        transformOrigin: "center", // Prevent layout shift
      }}
    >
      {/* Circular Progress Bar or Background Color */}
      {timer ? (
        <CircularProgress
          variant="determinate"
          value={(timer / 30) * 100}
          sx={{
            position: "absolute",
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            color: player.color,
            backgroundColor: "#d6d6d6", // Trail color
          }}
        />
      ) : (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            backgroundColor: "#d6d6d6",
          }}
        />
      )}

      {/* Player Name and Score */}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          color: "white",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        <Typography variant="body2" color={player.color}>
          {player.name}
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "5px",
          }}
        >
          <Typography variant="body2" color="white">
            {player.score}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default React.memo(PlayerAvatar);
