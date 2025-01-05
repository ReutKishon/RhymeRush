import React from "react";
import { List, ListItem, ListItemText } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useAppStore from "../../../store/useStore";
import { Popup } from "pixel-retroui";

interface GameResultsModalProps {
  showModal: boolean;
}
const GameResultsModal = ({ showModal }: GameResultsModalProps) => {
  const navigate = useNavigate();
  const players = useAppStore((state) => state.game.players);
  const isGameActive = useAppStore((state) => state.game.isActive);

  const onClose = () => {
    navigate("/home");
  };

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  if (isGameActive) {
    return null;
  }

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
          {sortedPlayers.map((player, index) => (
            <ListItem key={player.name}>
              <ListItemText
                primary={`${index + 1}. ${player.name}`}
                secondary={index === 0 ? "🏆 Winner" : null}
              />
            </ListItem>
          ))}
        </List>
      </div>
    </Popup>
  );
};

export default GameResultsModal;
