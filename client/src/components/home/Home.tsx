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
import LanguageSelector from '../common/LanguageSelector';
import { useTranslations } from "hooks/useTranslations";

const Home = () => {
  const navigate = useNavigate();
  const [showCreateGameModal, setShowCreateGameModal] = useState(false);
  const [showJoinGameModal, setShowJoinGameModal] = useState(false);
  const { connectionStatus } = useAppStore((state) => state);
  const t = useTranslations();
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
      className="flex h-screen flex-col items-center justify-center gap-6 p-4"
      style={connectionStatus ? {} : areaDisabledStyle}
    >
      <LanguageSelector />
      {/* Logo */}
      <img className="w-40" src={logo} alt="Rhyme Rush Logo" />



      {/* Button Container */}
      <div className="flex flex-col items-center w-3/4 max-w-md gap-6">
        {/* Create Game Button */}
        <button
          className="w-full h-12 bg-[#fefcd0] shadow-lg"
          onClick={handleCreateGame}
        >
          <p>{t.common.createGame}</p>
        </button>

        {/* Join Game Button */}
        <button
          className="secondary"
          onClick={handleJoinGame}
        >
          <span>{t.common.joinGame}</span>
        </button>
      </div>

      {/* Connection Lost Message */}
      {!connectionStatus && (
        <div className="flex items-center gap-2 red-600 lg font-semibold">
          <AiOutlineWifi size={24} />
          <span>{t.common.connectionLost}</span>
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
