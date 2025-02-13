import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services";
import useAppStore from "../../store/useStore";
import Modal from "../common/Modal";
import CustomInput from "../common/CustomInput";
import { validations } from "../../utils/validations";
import { useFormValidation } from "../../hooks/useFormValidation";
import { useTranslations } from "hooks/useTranslations";

interface JoinGameModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
}

const JoinGameModal = ({ showModal, setShowModal }: JoinGameModalProps) => {
  const [serverError, setServerError] = useState("");
  const { setUserName } = useAppStore((state) => state);
  const navigate = useNavigate();
  const t = useTranslations();
  const { values, errors, isValid, handleChange, handleBlur, validateForm } =
    useFormValidation({
      username: {
        value: "",
        validations: [
          validations.required,
          validations.minLength(3),
          validations.maxLength(20),
        ],
      },
      gameCode: {
        value: "",
        validations: [
          validations.required,
          // {
          //   validate: (value: string) => value.length === 36,
          //   message: "Invalid game code format"
          // }
        ],
      },
    });

  const handleEnterGame = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await api.joinGame(values.gameCode, values.username);
      setUserName(values.username);
      navigate(`/game/${values.gameCode}`);
    } catch (err: any) {
      console.log("err joining: ", err);
      if (err.response.data.message === "INVALID_GAME_CODE") {
        setServerError(t.game.errorCannotJoinCode);
      } else if (err.response.data.message === "NAME_ALREADY_TAKEN") {
        setServerError(t.game.errorCannotJoinName);
      } else {
        setServerError(t.game.errorCannotJoinGameStart);
      }
    }
  };

  return (
    <Modal
      isOpen={showModal}
      onClose={() => setShowModal(false)}
      title={t.common.joinGame}
      variant="primary"
      width="max-w-sm"
    >
      <div className="flex flex-col gap-4">
        <CustomInput
          placeholder={t.game.enterUsername}
          type="text"
          value={values.username}
          onChange={(e) => handleChange("username", e.target.value)}
          onBlur={() => handleBlur("username")}
          validations={[
            validations.required,
            validations.minLength(3),
            validations.maxLength(20),
          ]}
        />
        <CustomInput
          placeholder={t.game.enterGameCode}
          type="text"
          value={values.gameCode}
          onChange={(e) => handleChange("gameCode", e.target.value)}
          onBlur={() => handleBlur("gameCode")}
          validations={[
            validations.required,
            // {
            //   validate: (value: string) => value.length === 36,
            //   message: "Invalid game code format"
            // }
          ]}
        />
        {serverError && <p className="err">{serverError}</p>}
        <button
          onClick={handleEnterGame}
          className={`bg-primary-yellow ${
            !isValid ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={!isValid}
        >
          <p>{t.common.enterGame}</p>
        </button>
      </div>
    </Modal>
  );
};

export default JoinGameModal;
