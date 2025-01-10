import React from "react";
import { useNavigate } from "react-router-dom";
import useAppStore from "../../../store/useStore";
import Modal from "../../common/Modal";

interface GameResultsModalProps {
  showModal: boolean;
}

const GameResultsModal = ({ showModal }: GameResultsModalProps) => {
  const navigate = useNavigate();
  const players = useAppStore((state) => state.game.players);
  const isGameActive = useAppStore((state) => state.game.isActive);

  const onClose = () => {
    navigate("/");
  };

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  if (isGameActive || !showModal) {
    return null;
  }

  return (
    <Modal 
      isOpen={showModal} 
      onClose={onClose}
      title="Game Over"
      width="max-w-md"
    >
      <div className="flex flex-col gap-4">
        <ul className="space-y-3">
          {sortedPlayers.map((player, index) => (
            <li
              key={index}
              className="flex items-center justify-between bg-white bg-opacity-10 p-3 rounded-lg"
            >
              <div className="flex items-center">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-black font-bold mr-3"
                  style={{
                    backgroundColor: player.color,
                  }}
                >
                  {index + 1}
                </div>
                <span className="font-semibold">{player.name}</span>
              </div>
              <span className="text-lg font-bold">{player.score} pts</span>
            </li>
          ))}
        </ul>
        <button
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </Modal>
  );
};

export default GameResultsModal;
