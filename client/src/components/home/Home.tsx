import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home: React.FC = ({}) => {
  const navigate = useNavigate();

  const handleCreateGame = async () => {
    navigate(`/create-game`); 
  };

  const handleJoinGame = async () => {
    navigate(`/join-game`);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4">Let's Write Songs</h2>
        <button
          onClick={handleCreateGame}
          className="bg-green-500 text-white rounded px-4 py-2 hover:bg-green-600 w-full mb-2"
        >
          Create New Game
        </button>
        <button
          onClick={handleJoinGame}
          className="bg-green-500 text-white rounded px-4 py-2 hover:bg-green-600 w-full mb-2"
        >
          Join Game
        </button>
      </div>
    </div>
  );
};

export default Home;
