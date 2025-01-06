import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services";
import useAppStore from "../../store/useStore";
import { AiFillCloseCircle } from "react-icons/ai";

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

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50">
      <div
        className="bg-gradient-to-br from-blue-500 to-teal-500 p-6 rounded-2xl shadow-2xl text-white max-w-sm w-full relative"
        onClick={(e) => e.stopPropagation()} // Prevent click bubbling
      >
        <button
          onClick={onCloseModal}
          className="absolute top-4 right-4 text-white hover:text-yellow-300 focus:outline-none"
          aria-label="Close"
        >
          <AiFillCloseCircle size={24} />
        </button>
        <h2 className="text-4xl font-bold text-center mb-6 text-yellow-300">
          🚀 Join A Game 🎮
        </h2>
        <div className="mb-4">
          <label className="block text-lg mb-2">Your Username</label>
          <input
            placeholder="Enter your username"
            type="text"
            onChange={handleUserNameChange}
            value={userNameInput}
            className="w-full border-none rounded-xl py-3 pl-4 text-black bg-yellow-100 focus:ring-4 focus:ring-yellow-300 focus:outline-none"
          />
        </div>
        <div className="mb-4">
          <label className="block text-lg mb-2">Game Code</label>
          <input
            placeholder="Enter a game code"
            type="text"
            value={gameCode}
            onChange={handleGameCodeChange}
            className="w-full border-none rounded-xl py-3 px-4 text-black bg-yellow-100 focus:ring-4 focus:ring-yellow-300 focus:outline-none"
          />
        </div>
        {errorMessage && (
          <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
        )}
        <button
          onClick={handleEnterGame}
          className="bg-yellow-400 text-black font-bold rounded-full px-6 py-3 hover:bg-yellow-300 focus:ring-4 focus:ring-yellow-200 w-full transition-all duration-200"
        >
          Enter Game
        </button>
      </div>
    </div>
  );
};

export default JoinGameModal;
