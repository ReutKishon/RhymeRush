import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services";
import { v4 as uuidv4 } from "uuid";
import useAppStore from "../../store/useStore";
import GameTimerSelection from "./GameTimerSelection";
import Modal from "../common/Modal";

interface CreateGameModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
}

const CreateGameModal = ({ showModal, setShowModal }: CreateGameModalProps) => {
  const [currentStep, setCurrentStep] = useState<"enterUsername" | "gameCreated">("enterUsername");
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
    const generatedCode = uuidv4();
    const game = await api.createGame(generatedCode, username, gameTimer);

    setGameCode(game.code);
    setCurrentStep("gameCreated");
  };


  const handleCodeCopy = () => {
    navigator.clipboard.writeText(gameCode).then(
      () => alert("Copied to clipboard!"),
      (err) => console.error("Failed to copy: ", err)
    );
  };

  return (
    <Modal
      isOpen={showModal}
      onClose={() => {
        setShowModal(false);
        setCurrentStep("enterUsername");
      }}
      title={currentStep === "enterUsername" ? "Create a New Game" : "Game Created"}
    >
      {currentStep === "enterUsername" && (
        <div className="flex items-center flex-col gap-4">
          <input
            type="text"
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
            className=""
          >
            <p>Create Game</p>
          </button>
        </div>
      )}

      {currentStep === "gameCreated" && (
        <div className="flex flex-col justify-center w-full gap-4">
          <p className="lg text-center yellow-100">
            Share this code with your friends to join:
          </p>
          <div className="w-full flex items-center justify-between bg-yellow-100 rounded-xl py-3 px-4">
            <h5 className="text-center">{gameCode}</h5>
            <button onClick={handleCodeCopy}>
              <i className="material-icons">content_copy</i>
            </button>
          </div>

          <button
            onClick={() => navigate(`/game/${gameCode}`)}
          >
            Enter Game
          </button>
        </div>
      )}
    </Modal>
  );
};

export default CreateGameModal;
