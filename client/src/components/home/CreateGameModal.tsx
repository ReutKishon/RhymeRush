import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services";
import { v4 as uuidv4 } from "uuid";
import useAppStore from "../../store/useStore";
import GameTimerSelector from "./GameTimerSelection";
import Modal from "../common/Modal";
import { validations } from '../../utils/validations';
import CustomInput from '../common/CustomInput';
import { useFormValidation } from "../../hooks/useFormValidation";
import { useTranslations } from "hooks/useTranslations";

interface CreateGameModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
}

const CreateGameModal = ({ showModal, setShowModal }: CreateGameModalProps) => {
  const [currentStep, setCurrentStep] = useState<"enterUsername" | "gameCreated">("enterUsername");
  const [gameCode, setGameCode] = useState("");
  const [gameTimer, setGameTimer] = useState(3);
  const [isCopied, setIsCopied] = useState(false);
  const { setUserName } = useAppStore((state) => state);
  const t = useTranslations();
  const navigate = useNavigate();

  const {
    values,
    errors,
    isValid,
    handleChange,
    handleBlur,
    validateForm
  } = useFormValidation({
    username: {
      value: "",
      validations: [
        validations.required,
        validations.minLength(3),
        validations.maxLength(10)
      ]
    }
  });

  const handleCreateGame = async () => {
    if (!validateForm()) {
      return;
    }

    setUserName(values.username);
    const generatedCode = uuidv4();
    const game = await api.createGame(generatedCode, values.username, gameTimer);

    setGameCode(game.code);
    setCurrentStep("gameCreated");
  };

  const handleCodeCopy = () => {
    navigator.clipboard.writeText(gameCode).then(
      () => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      },
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
      title={currentStep === "enterUsername" ? t.game.createNewGame : t.game.gameCreated}
    >
      {currentStep === "enterUsername" && (
        <div className="flex items-center flex-col gap-4">
          <CustomInput
            type="text"
            value={values.username}
            onChange={(e) => handleChange('username', e.target.value)}
            onBlur={() => handleBlur('username')}
            placeholder={t.game.enterUsername}
            validations={[
              validations.required,
              validations.minLength(3),
              validations.maxLength(20)
            ]}
          />
          <GameTimerSelector
            gameTimer={gameTimer}
            setGameTimer={setGameTimer}
          />
          <button
            onClick={handleCreateGame}
            className={`${!isValid ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!isValid}
          >
            <p>{t.common.createGame}</p>
          </button>
        </div>
      )}

      {currentStep === "gameCreated" && (
        <div className="flex flex-col justify-center w-full gap-4">
          <p className="lg text-center yellow-100">
            {t.game.shareCode}
          </p>
          <div className="w-full flex items-center justify-between bg-yellow-100 rounded-xl py-3 px-4">
            <h5 className="text-center">{gameCode}</h5>
            <i onClick={handleCodeCopy} className="material-icons cursor-pointer">
              {isCopied ? 'check' : 'content_copy'}
            </i>
          </div>

          <button
            onClick={() => navigate(`/game/${gameCode}`)}
          >
            {t.common.enterGame}
          </button>
        </div>
      )}
    </Modal>
  );
};

export default CreateGameModal;
