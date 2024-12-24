import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { socket, api } from "../../services";
import useAppStore from "../../store/useStore.ts";
import { Popup } from "pixel-retroui";
import { Box } from "@mui/material";

interface JoinGameModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
}
const JoinGameModal = ({ showModal, setShowModal }: JoinGameModalProps) => {
  const [gameCode, setGameCode] = useState("");
  const { user } = useAppStore((state) => state);
  const navigate = useNavigate();

  const handleEnterGame = async () => {
    if (gameCode.trim() === "") {
      return;
    }
    try {
      socket.emit("joinGame", user.id, gameCode);
      navigate(`/game/${gameCode}`);
    } catch (err) {
      console.log(err);
    }
  };

  const onCloseModal = () => {
    setGameCode("");
    setShowModal(false);
  };

  const handleGameCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGameCode(event.target.value);
  };

  return (
    showModal && (
      <Box className="fixed inset-0 flex items-center justify-center">
        <Box className="w-[70%] max-w-[400px] h-[300px] sm:w-[80%] sm:h-[250px] md:w-[70%] md:h-[300px] lg:w-[60%] lg:h-[350px] xl:w-[50%] xl:h-[400px]">
          <Popup
            isOpen={showModal}
            onClose={onCloseModal}
            bg="#fefcd0"
            baseBg="#c381b5"
            textColor="black"
            borderColor="black"
          >
            <h2 className="text-xl font-bold mb-4">Join A Game</h2>
            <div className="mb-4">
              <input
                type="text"
                value={gameCode}
                onChange={handleGameCodeChange}
                className="w-full border border-gray-300 rounded px-4 py-2 bg-gray-100"
              />
            </div>
            <button
              onClick={handleEnterGame}
              className="bg-[#8bd98f] text-black rounded px-4 py-2 hover:bg-green-600 w-full mb-2"
            >
              Enter Game
            </button>
          </Popup>
        </Box>
      </Box>
    )
  );
};

export default JoinGameModal;
