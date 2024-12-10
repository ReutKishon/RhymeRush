import React from "react";
import { useNavigate } from "react-router-dom";
import useAppStore from "../../../store/useStore";

interface GameOverModalProps {
  setShowModal: (show: boolean) => void;
}
const GameEndModal = ({ setShowModal }: GameOverModalProps) => {
  const navigate = useNavigate();
  const { game } = useAppStore((state) => state);

  const handleSaveSong = () => {
    // Save the game and song data to the database
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate("/home");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-8 relative text-center">
        {/* Close Button */}
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={handleCloseModal}
        >
          X
        </button>

        <h2 className="text-2xl font-bold mb-4">Game End</h2>
        <h1 className="text-2xl font-bold mb-4">
          The Winner Is {game.players[game.winnerPlayerId]?.name}
        </h1>

        <button
          onClick={handleSaveSong}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Save Song
        </button>
      </div>
    </div>
  );
};

export default GameEndModal;
