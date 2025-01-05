import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import { Button } from "pixel-retroui";
import CreateGameModal from "./CreateGameModal";
import JoinGameModal from "./JoinGameModal";
import logo from "assets/images/RhymeRushLogo-removebg-preview.png";
const Home = () => {
  const navigate = useNavigate();
  const [showCreateGameModal, setShowCreateGameModal] = useState(false);
  const [showJoinGameModal, setShowJoinGameModal] = useState(false);


  const handleCreateGame = () => {
    setShowCreateGameModal(true);
  };

  const handleJoinGame = () => {
    setShowJoinGameModal(true);
  };

  // const handleMySongs = () => {
  //   navigate(`/my-songs`);
  // };

  return (
    <div className="flex h-screen flex-col p-2 items-center justify-center gap-4">
      <img className="w-32" src={logo} alt="Rhyme Rush Logo" />
      <div
        className="flex flex-col w-2/3 items-center gap-4"
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
      </div>

      <CreateGameModal
        showModal={showCreateGameModal}
        setShowModal={setShowCreateGameModal}
      />
      <JoinGameModal
        showModal={showJoinGameModal}
        setShowModal={setShowJoinGameModal}
      />
    </div>
  );
};

export default Home;
