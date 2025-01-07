import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services";
import { v4 as uuidv4 } from "uuid";
import useAppStore from "../../store/useStore";
import { AiFillCloseCircle } from "react-icons/ai";
import GameTimerSelection from "./GameTimerSelection";

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
      <div className="w-[70%] max-w-[400px] h-[300px] sm:w-[80%] sm:h-[250px] md:w-[70%] md:h-[300px] lg:w-[60%] lg:h-[350px] xl:w-[50%] xl:h-[400px]">
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-6 rounded-2xl shadow-2xl white w-full h-full relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 white hover:yellow-300 focus:outline-none"
            aria-label="Close"
          >
            <AiFillCloseCircle size={24} />
          </button>

          {currentStep === "enterUsername" && (
            <div>
              <h2 className="4xl font-bold center mb-6 yellow-300">
                Create a New Game
              </h2>
              <div className="mb-6">
                <label className="block lg mb-2">Your Name</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full border-none rounded-xl py-3 pl-4 black bg-yellow-100 focus:ring-4 focus:ring-yellow-300 focus:outline-none"
                />
              </div>
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
    </div>
  );
};
export default CreateGameModal;
