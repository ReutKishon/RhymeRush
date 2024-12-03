import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAppStore from "../../store/useStore";
import { jwtDecode } from "jwt-decode";
const Home = () => {
  const navigate = useNavigate();
  const {user, setUser } = useAppStore()

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
