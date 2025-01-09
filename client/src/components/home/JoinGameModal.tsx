import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services";
import useAppStore from "../../store/useStore";
import Modal from "../common/Modal";

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

  return (
    <Modal
      isOpen={showModal}
      onClose={() => setShowModal(false)}
      title="Join A Game"
      variant="primary"
      width="max-w-sm"
    >
      <div className="flex flex-col gap-4">
        <input
          placeholder="Enter your username"
          type="text"
          onChange={handleUserNameChange}
          value={userNameInput}
        />
        <input
          placeholder="Enter a game code"
          type="text"
          value={gameCode}
          onChange={handleGameCodeChange}
        />
        {errorMessage && (
          <p className="err">{errorMessage}</p>
        )}
        <button
          onClick={handleEnterGame}
          className="bg-primary-yellow"
        >
          <p>Enter Game</p>
        </button>
      </div>
    </Modal>
  );
};

export default JoinGameModal;
