import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useSocketEvents from "../../hooks/useSocketEvents";
import useAppStore from "../../store/useStore";
import GameResultsModal from "./modals/GameResultsModal";
import GameTimer from "./GameTimer";
import { socket, api } from "../../services";
import SongLyrics from "./SongLyrics";
import Players from "./Players";
import ExitButton from "./ExitButton";

const GameBoard = () => {
  const navigate = useNavigate();
  const { gameCode } = useParams<{ gameCode: string }>();
  const [sentenceInput, setSentenceInput] = useState<string>("");
  const [addSentenceError, setAddSentenceError] = useState<string>("");

  const { setGame, setGameCode, resetGame } = useAppStore((state) => state);
  const {
    game,
    user: { username },
  } = useAppStore((state) => state);
  const [showResultsModal, setShowResultsModal] = useState<boolean>(false);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        if (gameCode) {
          const game = await api.fetchGameData(gameCode);
          setGame(game);
          setGameCode(gameCode);
        }
      } catch (err) {
        console.error("Failed to fetch game details: ", err);
      }
    };
    resetGame();
    fetchGame();
  }, [gameCode]);

  useSocketEvents({ setShowResultsModal, setAddSentenceError });

  const onStartGamePress = () => {
    socket.emit("startGame");
  };

  const handleSentenceSubmit = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;
    const trimmedSentence = sentenceInput.trim();
    if (trimmedSentence === "") {
      setAddSentenceError("Please enter something!");
      return;
    }

    socket.emit("addSentence", trimmedSentence);
    setSentenceInput("");
    setAddSentenceError("");
  };

  return (
    <div className="flex flex-col h-screen bg-primary-purple">
      {/* Header Section */}
      <div className="flex justify-between items-center p-4">
        <GameTimer />
        <ExitButton />
      </div>

      {/* Topic/Title Section */}
      <div className="text-center py-2">
        <h3 className="font-bold">{game.topic}</h3>
      </div>

      {/* Main Content Section - Using grid for desktop */}
      <div className="flex-1 flex flex-col md:grid md:grid-cols-3 gap-4 p-4 overflow-hidden">
        {/* Empty First Column on Desktop */}
        <div className="hidden md:block"></div>

        {/* Players Section - Row on mobile, Column on desktop */}
        <div className="md:order-last md:col-span-1">
          <Players
            players={game.players}
            gameIsActive={game.isActive}
            currentPlayerName={game.currentPlayerName}
          />
        </div>

        {/* Center Lyrics Section */}
        <div className="flex-1 overflow-y-auto md:col-span-1">
          <SongLyrics lyrics={game.lyrics} />
        </div>
      </div>

      {/* Input Section */}
      <div className="p-4">
        {!game.isActive && username === game.gameCreatorName && (
          <button 
            onClick={onStartGamePress}
            className="bg-primary-yellow w-full py-3 rounded-xl"
          >
            Start Game
          </button>
        )}
        
        {game.isActive && (
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                className="W-full bg-primary-yellow rounded-xl py-3 px-4"
                placeholder="Type your line and press Enter"
                onChange={(e) => setSentenceInput(e.target.value)}
                disabled={!game.isActive || game.currentPlayerName !== username}
                value={sentenceInput}
                onKeyUp={handleSentenceSubmit}
              />
              <button
                onClick={() => {
                  if (sentenceInput.trim()) {
                    socket.emit("addSentence", sentenceInput.trim());
                    setSentenceInput("");
                    setAddSentenceError("");
                  }
                }}
                disabled={!game.isActive || game.currentPlayerName !== username || !sentenceInput.trim()}
                className={`bg-primary-green rounded-lg w-24
                  ${(!game.isActive || game.currentPlayerName !== username || !sentenceInput.trim()) 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-primary-pink transition-colors'
                  }`}
              >
                →
              </button>
            </div>
            {addSentenceError && (
              <p className="text-red-500 text-sm">{addSentenceError}</p>
            )}
          </div>
        )}
      </div>

      <GameResultsModal showModal={showResultsModal} />
    </div>
  );
};

export default GameBoard;
