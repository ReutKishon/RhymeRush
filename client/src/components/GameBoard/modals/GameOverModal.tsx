import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
} from "@mui/material";

interface GameOverModalProps {
  show: boolean;
  player: string | null;
  reason: string | null;
  onClose: () => void;
}

const GameOverModal = ({
  show,
  player,
  reason,
  onClose,
}: GameOverModalProps) => {
  return (
    <Dialog
      open={show}
      onClose={onClose}
      aria-labelledby="game-over-title"
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle id="game-over-title">
        <Typography variant="h5" align="center" color="error">
          Game Over!
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="h6" gutterBottom>
            Player: <strong>{player ?? "Unknown"}</strong>
          </Typography>
          <Typography variant="body1">
            Reason: <strong>{reason ?? "No reason provided"}</strong>
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary" fullWidth>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GameOverModal;
