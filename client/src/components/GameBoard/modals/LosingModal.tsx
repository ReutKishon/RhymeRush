import React, { useEffect } from "react";
import { Typography, Box } from "@mui/material";
import { Popup } from "pixel-retroui";

interface GameOverModalProps {
  showModal: boolean;
  playerName: string;
  reason: string;
  onClose: () => void;
}

const LosingModal = ({
  showModal,
  playerName,
  reason,
  onClose,
}: GameOverModalProps) => {

  useEffect(() => {
    if (showModal) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000); // Close modal after 3 seconds

      // Cleanup timer on unmount or if showModal changes
      return () => clearTimeout(timer);
    }
  }, [showModal, onClose]);

  return (
    <Popup
      isOpen={showModal}
      onClose={onClose}
      bg="#fefcd0"
      baseBg="#de1f38"
      textColor="black"
      borderColor="black"
      className="w-full"
      title="Losing"
      closeButtonText="close"
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="h6" gutterBottom>
          Player: <strong>{playerName}</strong>
        </Typography>
        <Typography variant="body1">
          Reason: <strong>{reason}</strong>
        </Typography>
      </Box>
    </Popup>
  );
};

export default LosingModal;
