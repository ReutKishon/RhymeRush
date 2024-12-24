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
import { Popup } from "pixel-retroui";

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
    <Popup
      isOpen={showModal}
      onClose={onClose}
      bg="#fefcd0"
      baseBg="#de1f38"
      textColor="black"
      borderColor="black"
      className="w-full"
    >
      <div>
        {/* Title */}
        <h4 className="mb-2">Game Over 🏁</h4>

        {/* Player Rankings */}

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
      </div>
    </Popup>
  );
};

export default GameResultsModal;
