import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAppStore from "../../store/useStore";
import { Box, Typography, Button } from "@mui/material";
const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("authToken")) {
      navigate("/login");
    }
  }, [navigate]);

  const handleCreateGame = () => {
    navigate(`/create-game`);
  };

  const handleJoinGame = () => {
    navigate(`/join-game`);
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
        <Button
          onClick={handleMySongs}
          variant="contained"
          sx={{
            backgroundColor: "#22c55e", // Tailwind's green-500
            "&:hover": { backgroundColor: "#16a34a" }, // Tailwind's green-600
            color: "white",
            borderRadius: 1,
            px: 2,
            py: 1,
          }}
        >
          My Songs
        </Button>
      </Box>
      <Box
        sx={{
          p: 4,
          width: "24rem",
          textAlign: "center",
        }}
      >
        <Button
          onClick={handleCreateGame}
          variant="contained"
          sx={{
            backgroundColor: "#669999",
            "&:hover": { backgroundColor: "#16a34a" }, // Tailwind's green-600
            color: "white",
            borderRadius: 4,
            px: 2,
            py: 1,
            width: "100%",
            mb: 2,
          }}
        >
          Create New Game
        </Button>

        <Button
          onClick={handleJoinGame}
          variant="contained"
          sx={{
            backgroundColor: "#00e6ac",
            "&:hover": { backgroundColor: "#00e6ac" },
            color: "white",
            borderRadius: 4,
            px: 2,
            py: 1,
            width: "100%",
          }}
        >
          Join Game
        </Button>
      </Box>
    </Box>
  );
};

export default Home;
