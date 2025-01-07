import React, { useEffect, useState } from "react";
import { Player } from "../../../../shared/types/gameTypes";
import { Box, CircularProgress, SvgIcon } from "@mui/material";

interface PlayerProps {
  player: Player;
  isPlayerTurn: boolean;
}

const PlayerAvatar = ({ player, isPlayerTurn }: PlayerProps) => {
  const [timer, setTimer] = useState<number | null>(null);

  useEffect(() => {
    let intervalId: any;

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
    <div className="relative bg-gradient-to-br from-purple-500 to-pink-500 rounded-full shadow-xs w-[150px] h-[150px]">
      {/* Circular Progress Bar */}
      <div className="absolute inset-0 w-full h-full flex items-center justify-center">
        {timer && (
          <CircularProgress
            variant="determinate"
            value={(timer / 30) * 100}
            className="absolute inset-0 w-full h-full"
            sx={{
              color: "pink", // Progress color
              "& .MuiCircularProgress-circle": {
                strokeWidth: 3, // Adjust the thickness of the progress bar
              },
            }}
          />
        )}
        {/* Avatar Content */}
        <div className="text-center">
          <div
            className="text-2xl font-bold truncate"
            style={{ color: player.color }}
          >
            {player.name}
          </div>
          <div className="text-sm font-medium text-yellow-200">
            Score: <span className="font-bold">{player.score}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PlayerAvatar);
