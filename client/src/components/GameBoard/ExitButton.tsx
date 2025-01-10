import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../common/Modal';
import { IoExitOutline } from "react-icons/io5";

const ExitButton = () => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const navigate = useNavigate();

  const handleExit = () => {
    setShowConfirmModal(true);
  };

  const confirmExit = () => {
    navigate('/', { replace: true });
  };

  return (
    <>
      <button
        onClick={handleExit}
        className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 w-auto p-2 rounded-full flex items-cen"
      >
        <IoExitOutline className="text-white text-xl" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-[80px] transition-all duration-300 text-white">
          Exit
        </span>
      </button>

      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Exit Game"
      >
        <div className="flex flex-col gap-4">
          <p className="text-center">Are you sure you want to exit the game?</p>
          <div className="flex gap-4">
            <button
              onClick={() => setShowConfirmModal(false)}
              className="bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={confirmExit}
              className="bg-primary-blue"
            >
              Exit
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ExitButton; 