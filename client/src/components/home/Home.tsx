import React, {
  CSSProperties,
  StyleHTMLAttributes,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import CreateGameModal from "./CreateGameModal";
import JoinGameModal from "./JoinGameModal";
import logo from "assets/images/RhymeRushLogo-removebg-preview.png";
import useAppStore from "store/useStore";
import { AiOutlineWifi } from "react-icons/ai";
const Home = () => {
  const navigate = useNavigate();
  const [showCreateGameModal, setShowCreateGameModal] = useState(false);
  const [showJoinGameModal, setShowJoinGameModal] = useState(false);
  const { connectionStatus } = useAppStore((state) => state);

  const handleCreateGame = () => {
    setShowCreateGameModal(true);
  };

  const handleJoinGame = () => {
    setShowJoinGameModal(true);
  };

  const areaDisabledStyle: CSSProperties = {
    pointerEvents: "none",
    opacity: 0.5,
  };

  return (
    <div
      className="flex h-screen flex-col items-center justify-center gap-6 p-4 bg-gradient-to-br from-purple-400 to-pink-300"
      style={connectionStatus ? {} : areaDisabledStyle}
    >
      {/* Logo */}
      <img className="w-40 mb-4" src={logo} alt="Rhyme Rush Logo" />

      {/* Button Container */}
      <div className="flex flex-col items-center w-3/4 max-w-md gap-6">
        {/* Create Game Button */}
        <button
          className="w-full h-12 bg-[#fefcd0] rounded-full text-black text-lg font-bold shadow-lg shadow-[#c381b5] hover:scale-105 transform transition-all duration-200"
          onClick={handleCreateGame}
        >
          🌟 Create New Game
        </button>

        {/* Join Game Button */}
        <button
          className="w-full h-12 bg-[#c7f5a4] rounded-full text-black text-lg font-bold shadow-lg shadow-[#c381b5] hover:scale-105 transform transition-all duration-200"
          onClick={handleJoinGame}
        >
          🎮 Join Game
        </button>
      </div>

      {/* Connection Lost Message */}
      {!connectionStatus && (
        <div className="mt-6 flex items-center gap-2 text-red-600 text-lg font-semibold">
          <AiOutlineWifi size={24} />
          <span>Connection lost. Try again later...</span>
        </div>
      )}

      {/* Modals */}
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
