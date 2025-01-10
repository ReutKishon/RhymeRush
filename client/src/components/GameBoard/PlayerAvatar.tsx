import React, { useEffect, useState } from "react";
import { Player } from "../../../../shared/types/gameTypes";
import { Box, CircularProgress, SvgIcon } from "@mui/material";
import { useTranslations } from "hooks/useTranslations";

interface PlayerProps {
  player: Player;
  isPlayerTurn: boolean;
}

const PlayerAvatar = ({ player, isPlayerTurn }: PlayerProps) => {
  const [timer, setTimer] = useState<number | null>(null);
  const t = useTranslations();
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
    <div className="relative bg-primary-blue rounded-full w-[100px] h-[100px] lg:w-[120px] lg:h-[120px]">
      {/* Circular Progress Bar */}
      <div className="absolute inset-0 flex items-center justify-center">
        {timer && (
          <CircularProgress
            variant="determinate"
            value={(timer / 30) * 100}
            className="absolute inset-0 w-full h-full"
            sx={{
              color: "pink",
              "& .MuiCircularProgress-circle": {
                strokeWidth: 3,
              },
            }}
          />
        )}
        {/* Avatar Content */}
        <div className="text-center">
          <p className="font-bold truncate ">{player.name}</p>
          <p>
            {t.game.score}:  {player.score} 
          </p>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PlayerAvatar);
