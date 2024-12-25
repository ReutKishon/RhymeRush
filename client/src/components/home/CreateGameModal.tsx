import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { socket, api } from "../../services";
import useAppStore from "../../store/useStore.ts";
import { Popup } from "pixel-retroui";
import { Box } from "@mui/material";

interface CreateGameModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
}
const CreateGameModal = ({ showModal, setShowModal }: CreateGameModalProps) => {
  const { user, addPlayer, reset } = useAppStore((state) => state);
  const [gameCode, setGameCode] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const createNewGame = async () => {
      try {
        const game = await api.createGame(user.id);
        socket.emit("gameCreated", game.code, user.id);

        addPlayer(game.players[0]);
        setGameCode(game.code);
      } catch (err) {
        console.error("Error creating game:", err);
      }
    };
    if (user.id) {
      createNewGame();
    }
  }, [user.id]);

  const handleEnterGame = () => {
    if (!gameCode) {
      return;
    }
    reset();
    navigate(`/game/${gameCode}`);
  };

  return (
    showModal && (
      <Box className="fixed inset-0 flex items-center justify-center">
        <Box className="w-[70%] max-w-[400px] h-[300px] sm:w-[80%] sm:h-[250px] md:w-[70%] md:h-[300px] lg:w-[60%] lg:h-[350px] xl:w-[50%] xl:h-[400px]">
          <Popup
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            bg="#fefcd0"
            baseBg="#c381b5"
            textColor="black"
            borderColor="black"
          >
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
          </Popup>
        </Box>
      </Box>
    )
  );
};

export default CreateGameModal;
