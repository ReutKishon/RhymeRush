import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAppStore from "../../store/useStore";
import { Box, Typography } from "@mui/material";
import { Button } from "pixel-retroui";
import CreateGameModal from "./CreateGameModal";
import JoinGameModal from "./JoinGameModal";
const Home = () => {
  const navigate = useNavigate();
  const [showCreateGameModal, setShowCreateGameModal] = useState(false);
  const [showJoinGameModal, setShowJoinGameModal] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("authToken")) {
      navigate("/login");
    }
  }, [navigate]);

  const handleCreateGame = () => {
    setShowCreateGameModal(true);
  };

  const handleJoinGame = () => {
    setShowJoinGameModal(true);
  };

  const handleMySongs = () => {
    navigate(`/my-songs`);
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 16,
          right: 16,
        }}
      >
        <Button onClick={handleMySongs}>My Songs</Button>
      </Box>
      <Box
        sx={{
          width: "30%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
        }}
        className="w-full sm:w-2/3 md:w-1/2 lg:w-1/3 xl:w-1/4 mx-auto p-4"
      >
        <Button
          className="w-[70%] sx:"
          onClick={handleCreateGame}
          bg="#fefcd0"
          textColor="black"
          borderColor="black"
          shadow="#c381b5"
        >
          Create New Game
        </Button>

        <Button
          style={{ width: "70%" }}
          onClick={handleJoinGame}
          bg="#c7f5a4"
          textColor="black"
          borderColor="black"
          shadow="#c381b5"
        >
          Join Game
        </Button>
      </Box>

      <CreateGameModal
        showModal={showCreateGameModal}
        setShowModal={setShowCreateGameModal}
      />
      <JoinGameModal
        showModal={showJoinGameModal}
        setShowModal={setShowJoinGameModal}
      />
    </Box>
  );
};

export default Home;
