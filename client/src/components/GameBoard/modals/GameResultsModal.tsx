import React from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Player } from "../../../../../shared/types/gameTypes";
import useAppStore from "../../../store/useStore";

interface GameResultsModalProps {
  showModal: boolean;
}
const GameResultsModal = ({ showModal }: GameResultsModalProps) => {
  const navigate = useNavigate();
  const players = useAppStore((state) => state.game.players);
  const onClose = () => {
    navigate("/home");
  };

  return (
    <Modal
      open={showModal}
      onClose={onClose}
      aria-labelledby="game-results-title"
      aria-describedby="game-results-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          textAlign: "center",
        }}
      >
        {/* Title */}
        <Typography id="game-results-title" variant="h4" sx={{ mb: 2 }}>
          Game Over! 🏁
        </Typography>

        {/* Player Rankings */}
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          Final Standings:
        </Typography>

        <List sx={{ maxHeight: 200, overflowY: "auto" }}>
          {players
            .sort((a, b) => a.rank - b.rank)
            .map((player) => (
              <ListItem key={player.id}>
                <ListItemText
                  primary={`${player.rank + 1}. ${player.name}`}
                  secondary={player.rank === 0 ? "🏆 Winner" : null}
                />
              </ListItem>
            ))}
        </List>

        <Button
          onClick={onClose}
          variant="contained"
          color="primary"
          sx={{ mt: 2, width: "100%" }}
        >
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default GameResultsModal;
