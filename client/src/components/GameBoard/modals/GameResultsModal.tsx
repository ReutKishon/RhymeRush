import React from "react";
import { List, ListItem, ListItemText } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useAppStore from "../../../store/useStore";
import { Popup } from "pixel-retroui";

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
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50">
      <div
        className="bg-gradient-to-br from-purple-500 to-pink-500 p-6 rounded-xl shadow-lg text-white max-w-md w-full relative"
        onClick={(e) => e.stopPropagation()} // Prevent click bubbling
      >
        <h2 className="text-3xl font-bold text-center mb-4">
          🎉 Game Over! 🎮
        </h2>
        <p className="text-center text-sm mb-6">Here are the final scores:</p>
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
                    // backgroundImage: `url(${player.avatarUrl})`,
                    // backgroundSize: "cover",
                    // backgroundPosition: "center",
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
          className="mt-6 w-full py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-300 focus:ring-4 focus:ring-yellow-200"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default GameResultsModal;
