import { Box, IconButton, Modal, Typography } from "@mui/material";
import React from "react";
import CloseIcon from "@mui/icons-material/Close";

interface GameOverModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  reason: string;
}
const GameOverModal = ({
  showModal,
  setShowModal,
  reason,
}: GameOverModalProps) => {
  return (
    <Modal
      open={showModal}
      onClose={() => setShowModal(false)}
      aria-labelledby="game-over-title"
      aria-describedby="game-over-description"
    >
      <Box
        sx={{
          backgroundColor: "white",
          borderRadius: 2,
          p: 4,
          position: "relative",
          textAlign: "center",
          width: "100%",
          maxWidth: "400px",
          margin: "auto",
          top: "50%",
          transform: "translateY(-50%)",
        }}
      >
        <IconButton
          onClick={() => setShowModal(false)}
          aria-label="Close Modal"
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            color: "gray",
            "&:hover": {
              color: "#555",
            },
          }}
        >
          <CloseIcon />
        </IconButton>

        <Typography
          id="game-over-title"
          variant="h2"
          sx={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            mb: 2,
          }}
        >
          Game Over
        </Typography>

        <Typography
          id="game-over-description"
          variant="h1"
          sx={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            mb: 2,
          }}
        >
          {reason}
        </Typography>
      </Box>
    </Modal>
  );
};

export default GameOverModal;
