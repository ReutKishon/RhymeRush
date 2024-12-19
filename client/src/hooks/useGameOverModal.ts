import { useState, useEffect } from 'react';

interface UseGameOverModalReturn {
  showGameOverModal: boolean;
  losingPlayerName: string | null;
  losingReason: string | null;
  triggerGameOverModal: (playerName: string, reason: string) => void;
  hideGameOverModal: () => void;
}

const useGameOverModal = (): UseGameOverModalReturn => {
  const [showGameOverModal, setShowGameOverModal] = useState(false);
  const [losingPlayerName, setLosingPlayerName] = useState<string | null>(null);
  const [losingReason, setLosingReason] = useState<string | null>(null);

  const triggerGameOverModal = (playerName: string, reason: string) => {
    setLosingPlayerName(playerName);
    setLosingReason(reason);
    setShowGameOverModal(true);

    // Auto-hide modal after 3 seconds
    const timer = setTimeout(() => {
      setShowGameOverModal(false);
      setLosingPlayerName(null);
      setLosingReason(null);
    }, 3000);

    // Cleanup timer on component unmount
    return () => clearTimeout(timer);
  };

  const hideGameOverModal = () => {
    setShowGameOverModal(false);
    setLosingPlayerName(null);
    setLosingReason(null);
  };

  return {
    showGameOverModal,
    losingPlayerName,
    losingReason,
    triggerGameOverModal,
    hideGameOverModal
  };
};

export default useGameOverModal;
