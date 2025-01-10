import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../common/Modal";
import { IoExitOutline } from "react-icons/io5";
import { useTranslations } from "hooks/useTranslations";
import { socket } from "../../services";

const ExitButton = () => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const navigate = useNavigate();
  const t = useTranslations();
  const handleExit = () => {
    setShowConfirmModal(true);
  };

  const confirmExit = () => {
    socket.emit("leaveGame");
    navigate("/", { replace: true });
  };

  return (
    <>
      <button
        onClick={handleExit}
        className="w-auto flex items-center gap-2 p-3 rounded-full    bg-red-500 hover:bg-red-600"
      >
        <IoExitOutline className="text-primary-yellow text-xl" />
        <p className="text-primary-yellow">{t.common.exit}</p>
      </button>

      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title={t.common.exit}
      >
        <div className="flex flex-col gap-4">
          <p className="text-center">{t.common.exitMessage}</p>
          <div className="flex gap-4">
            <button
              onClick={() => setShowConfirmModal(false)}
              className="bg-gray-200"
            >
              {t.common.cancel}
            </button>
            <button onClick={confirmExit} className="bg-primary-blue">
              {t.common.exit}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ExitButton;
