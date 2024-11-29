import React from "react";
import { useNavigate } from "react-router-dom";
import useGameStore from "../../../store/useStore";

interface GameOverModalProps {
  isVisible: boolean;
}

const GameEndModal: React.FC<GameOverModalProps> = ({ isVisible }) => {
  const { winner } = useGameStore();

  const navigate = useNavigate();

  if (!isVisible) return null;

  const handleSaveSong = () => {
    // Save the game and song data to the database
   
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-8 relative text-center">
        {/* Close Button */}
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={() => navigate("/home")}
          aria-label="Close Modal"
        >
          X
        </button>

        {/* Modal Content */}
        <h2 className="text-2xl font-bold mb-4">Game Over</h2>
        <p className="text-gray-700 mb-6">The Winner Is {winner?.username}</p>

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
