import React from "react";
import { useNavigate } from "react-router-dom";
import useAppStore from "../../../store/useStore";
import { Box, Button, IconButton, Modal, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { saveSong } from "../../../services/api";

interface GameOverModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
}
const GameEndModal = ({ showModal, setShowModal }: GameOverModalProps) => {
  const navigate = useNavigate();
  const { game } = useAppStore((state) => state);

  const handleSaveSong = async () => {
    try {
      await saveSong(game.code);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate("/home");
  };

  return (
    <Modal
      open={showModal}
      onClose={handleCloseModal}
      aria-labelledby="game-end-title"
      aria-describedby="game-end-description"
    >
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "rgba(0, 0, 0, 0.5)",
          zIndex: 50,
        }}
      >
        <Box
          sx={{
            bgcolor: "white",
            borderRadius: 2,
            p: 4,
            position: "relative",
            textAlign: "center",
            width: "90%",
            maxWidth: "400px",
          }}
        >
          {/* Close Button */}
          <IconButton
            onClick={handleCloseModal}
            sx={{ position: "absolute", top: 8, right: 8, color: "gray" }}
          >
            <CloseIcon />
          </IconButton>

          <Typography id="game-end-title" variant="h4" fontWeight="bold" mb={2}>
            Game End
          </Typography>

          <Typography
            id="game-end-description"
            variant="h5"
            fontWeight="bold"
            mb={4}
          >
            The Winner Is {game.players[game.winnerPlayerId]?.name}
          </Typography>

          <Button
            onClick={handleSaveSong}
            variant="contained"
            sx={{
              bgcolor: "blue",
              color: "white",
              "&:hover": { bgcolor: "blue.600" },
            }}
          >
            Save Song
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default GameEndModal;
