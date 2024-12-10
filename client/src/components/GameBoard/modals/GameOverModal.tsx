import React from "react";

interface GameOverModalProps {
  setShowModal: (show: boolean) => void;
  reason: string;
}
const GameOverModal = ({
  setShowModal,
  reason,
}: GameOverModalProps) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-8 relative text-center">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={() => setShowModal(false)}
          aria-label="Close Modal"
        >
          X
        </button>

        <h2 className="text-2xl font-bold mb-4">Game Over</h2>
        <h1 className="text-2xl font-bold mb-4">{reason}</h1>
      </div>
    </div>
  );
};

export default GameOverModal;
