import React from "react";
import { useNavigate } from "react-router-dom";
import useGameStore from "../../../store/useStore";
import { Player } from "../../../../../shared/types/gameTypes";

interface playerLeftModalProps {
  isVisible: boolean;
  leftPlayer: string;
}

const PlayerLeftModal: React.FC<playerLeftModalProps> = ({
  isVisible,
  leftPlayer,
}) => {
  // const { playerData } = useFetchPlayer(gameCode);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-8 relative text-center">
        <h2 className="text-2xl font-bold mb-4">
          {/* {leftPlayer.username} loose and left the game */}
        </h2>
      </div>
    </div>
  );
};

export default PlayerLeftModal;
