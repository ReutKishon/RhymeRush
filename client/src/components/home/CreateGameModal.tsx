import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services";
import { v4 as uuidv4 } from "uuid";
import useAppStore from "../../store/useStore";
import { AiFillCloseCircle } from "react-icons/ai";
import GameTimerSelection from "./GameTimerSelection";
import { Input } from "pixel-retroui";

interface CreateGameModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
}

const CreateGameModal = ({ showModal, setShowModal }: CreateGameModalProps) => {
  const [currentStep, setCurrentStep] = useState<
    "enterUsername" | "gameCreated"
  >("enterUsername");
  const [username, setUsername] = useState("");
  const [gameCode, setGameCode] = useState("");
  const [gameTimer, setGameTimer] = useState(3);

  const navigate = useNavigate();
  const { setUserName } = useAppStore((state) => state);

  const handleCreateGame = async () => {
    if (!username.trim()) {
      alert("Please enter a username");
      return;
    }
    const generatedCode = uuidv4(); //TODO: move the generated code to the backend?
    const game = await api.createGame(generatedCode, username, gameTimer);

    setGameCode(game.code);
    setCurrentStep("gameCreated");
  };

  const handleEnterGame = () => {
    console.log(`Game Code: ${gameCode}, Username: ${username}`);
    setUserName(username);
    navigate(`/game/${gameCode}`);
  };
  const onClose = () => {
    setShowModal(false);
    setCurrentStep("enterUsername");
  };
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-primary-pink p-6 rounded-xl w-full md:w-2/3 ">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 white hover:yellow-300 focus:outline-none"
          aria-label="Close"
        >
          <AiFillCloseCircle size={24} />
        </button>

        {currentStep === "enterUsername" && (
          <div className="flex flex-col gap-2">
            <h2>Create a New Game</h2>
            <label className="lg mb-2">Your Name</label>
            <input
              type="text"
              className="w-full"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your name"
            />
            <GameTimerSelection
              gameTimer={gameTimer}
              setGameTimer={setGameTimer}
            />
            <button
              onClick={handleCreateGame}
              className="bg-yellow-400 black rounded-full px-6 py-3 hover:bg-yellow-300 focus:ring-4 focus:ring-yellow-200 w-full transition-all duration-200"
            >
              Create Game
            </button>
          </div>
        )}
        {currentStep === "gameCreated" && (
          <div>
            <h2 className="4xl font-bold text-center mb-6 yellow-300">
              🎉 Game Created!
            </h2>
            <p className="lg text-center mb-4 yellow-100">
              Share this code with your friends to join:
            </p>
            <div className="bg-yellow-100 black font-bold rounded-xl py-3 px-4 text-center mb-4">
              {gameCode}
            </div>

            <button
              onClick={handleEnterGame}
              className="bg-yellow-400 black font-bold rounded-full px-6 py-3 hover:bg-yellow-300 focus:ring-4 focus:ring-yellow-200 w-full transition-all duration-200"
            >
              Enter Game
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default CreateGameModal;
