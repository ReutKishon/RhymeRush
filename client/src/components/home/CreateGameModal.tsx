import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services";
import { Input, Popup } from "pixel-retroui";
import { Box } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import useAppStore from "../../store/useStore";

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
  const navigate = useNavigate();
  const { setUserName } = useAppStore((state) => state);

  const handleCreateGame = async () => {
    if (!username.trim()) {
      alert("Please enter a username");
      return;
    }
    const generatedCode = uuidv4(); //TODO: move the generated code to the backend?
    const game = await api.createGame(generatedCode, username);

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

  return (
    showModal && (
      <Box className="fixed inset-0 flex items-center justify-center">
        <Box className="w-[70%] max-w-[400px] h-[300px] sm:w-[80%] sm:h-[250px] md:w-[70%] md:h-[300px] lg:w-[60%] lg:h-[350px] xl:w-[50%] xl:h-[400px]">
          <Popup
            isOpen={showModal}
            onClose={onClose}
            bg="#fefcd0"
            baseBg="#c381b5"
            textColor="black"
            borderColor="black"
          >
            {currentStep === "enterUsername" && (
              <div>
                <h2 className="text-xl mb-4">Create a New Game</h2>
                <div className="mb-4">
                  <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full border border-gray-300 rounded py-2 pl-4"
                  />
                </div>
                <button
                  onClick={handleCreateGame}
                  className="bg-[#8bd98f] text-black rounded px-4 py-2 hover:bg-green-600 w-full mb-2"
                >
                  Create Game
                </button>
              </div>
            )}
            {currentStep === "gameCreated" && (
              <div>
                <h2 className="text-xl mb-4">Game Created!</h2>
                <p className="text-gray-700 mb-4">
                  Share this game code with others to join:
                </p>
                <div className="mb-4">
                  <input
                    type="text"
                    value={gameCode}
                    readOnly
                    className="w-full border border-gray-300 rounded py-2 pl-4"
                  />
                </div>
                <button
                  onClick={handleEnterGame}
                  className="bg-[#8bd98f] text-black rounded px-4 py-2 hover:bg-green-600 w-full mb-2"
                >
                  Enter Game
                </button>
              </div>
            )}
          </Popup>
        </Box>
      </Box>
    )
  );
};
export default CreateGameModal;
