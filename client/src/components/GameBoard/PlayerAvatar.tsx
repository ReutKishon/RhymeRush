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
    <div className="relative bg-gray-400 rounded-full w-[120px] h-[120px]">
      {/* Circular Progress Bar */}
      <div className="absolute inset-0 flex items-center justify-center">
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
          <h2 className="font-bold truncate">{player.name}</h2>
          <h4 className="font-medium">
            Score: <span className="font-bold">{player.score}</span>
          </h4>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PlayerAvatar);
