import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, socket } from "../../services";
import useAppStore from "../../store/useStore";
import { Popup, Input } from "pixel-retroui";
import { Box } from "@mui/material";

interface JoinGameModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
}

const JoinGameModal = ({ showModal, setShowModal }: JoinGameModalProps) => {
  const [gameCode, setGameCode] = useState("");
  const [userNameInput, setUserNameInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const { setUserName } = useAppStore((state) => state);
  const navigate = useNavigate();

  const handleEnterGame = async () => {
    if (gameCode.trim() === "" || userNameInput.trim() === "") {
      setErrorMessage("missing a game code or a username");
      return;
    }
    try {
      await api.joinGame(gameCode, userNameInput);
      setUserName(userNameInput);
      navigate(`/game/${gameCode}`);
    } catch (err: any) {
      setErrorMessage(err.response.data.message);
      return;
    }
  };

  const handleUserNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserNameInput(event.target.value);
  };

  const handleGameCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGameCode(event.target.value);
  };

  const onCloseModal = () => {
    setGameCode("");
    setShowModal(false);
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
              <Input
                placeholder="Enter your username"
                type="text"
                onChange={handleUserNameChange}
                value={userNameInput}
                className="w-full border border-gray-300 rounded py-2 pl-4"
              />
            </div>
            <div className="mb-4">
              <Input
                placeholder="Enter a game code"
                type="text"
                value={gameCode}
                onChange={handleGameCodeChange}
                className="w-full border border-gray-300 rounded px-4 py-2 bg-gray-100"
              />
            </div>
            {errorMessage && (
              <p className="text-red-600 text-sm mb-2">{errorMessage}</p>
            )}
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
