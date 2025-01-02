import React, { useEffect, useState } from "react";
import { Typography, Box } from "@mui/material";
import { Button, Popup } from "pixel-retroui";
import { useNavigate } from "react-router-dom";
import useAppStore from "../../../store/useStore";

const LosingModal = () => {
  const { losingReason, currentLoserName, userName } = useAppStore(
    (state) => state
  );
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setShowModal(userName === currentLoserName);
  }, [currentLoserName]);

  const handleStayInGame = () => {
    setShowModal(false);
  };
  const handleLeaveGame = () => {
    navigate(`/home`);
  };
  return (
    <Popup
      isOpen={showModal}
      onClose={handleStayInGame}
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
          <strong>You lose the game!</strong>
        </Typography>
        <Typography variant="body1">
          <strong>{losingReason}</strong>
        </Typography>
        <Button
          className="w-[70%] sx:"
          onClick={handleStayInGame}
          bg="#fefcd0"
          textColor="black"
          borderColor="black"
          shadow="#c381b5"
        >
          Stay in the game
        </Button>
        <Button
          className="w-[70%] sx:"
          onClick={handleLeaveGame}
          bg="#fefcd0"
          textColor="black"
          borderColor="black"
          shadow="#c381b5"
        >
          Leave the game
        </Button>
      </Box>
    </Popup>
  );
};

export default LosingModal;
