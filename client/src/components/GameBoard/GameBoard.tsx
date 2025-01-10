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
          console.log("Fetched game: ", game);
          setGame(game);
          setGameCode(gameCode); //TODO: remove gameCode state and use the field in game
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

  const handleSentenceSubmit = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key !== "Enter") return;
    const trimmedSentence = sentenceInput.trim();
    if (trimmedSentence === "") {
      setAddSentenceError(
        "Oops! It looks like you forgot to enter something. Please try again!"
      );
      return;
    }

    console.log("Emitting sentence:", trimmedSentence);
    socket.emit("addSentence", trimmedSentence);
    setSentenceInput("");
    setAddSentenceError("");
  };

  // Updated navigation prevention
  useEffect(() => {
    // Prevent default behavior of back/forward buttons
    const preventDefaultNavigation = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      // Chrome requires returnValue to be set
      e.returnValue = '';
    };

    // Prevent back button navigation
    const preventBackNavigation = () => {
      window.history.pushState(null, '', window.location.pathname);
    };

    // Initial state
    window.history.pushState(null, '', window.location.pathname);

    // Add event listeners
    window.addEventListener('beforeunload', preventDefaultNavigation);
    window.addEventListener('popstate', preventBackNavigation);

    // Block all navigation attempts
    window.onpopstate = () => {
      window.history.pushState(null, '', window.location.pathname);
    };

    // Cleanup
    return () => {
      window.removeEventListener('beforeunload', preventDefaultNavigation);
      window.removeEventListener('popstate', preventBackNavigation);
      window.onpopstate = null;
    };
  }, []);

  return (
    <div className="h-screen p-10 relative">
      <ExitButton />
      <div className="h-[10%] pl-20">
        <GameTimer />
      </div>
      <h3 className="flex justify-center font-bold">Love My Life</h3>

      <div className="flex pt-8 h-[60%]">
        <div className="w-[70%]">
          <SongLyrics lyrics={game.lyrics} />
        </div>
        <div className="w-[30%] flex justify-center pl-10">
          <Players
            players={game.players}
            gameIsActive={game.isActive}
            currentPlayerName={game.currentPlayerName}
          />
        </div>
      </div>
      <div className="flex p-20 justify-center">
        {!game.isActive && username == game.gameCreatorName && (
          <button onClick={onStartGamePress} >
            <h3 className="text-center">Start</h3>
          </button>
        )}
        {game.isActive && (
          <div className="w-full">
            <input
              placeholder="Type a new line"
              onChange={(e) => setSentenceInput(e.target.value)}
              disabled={!game.isActive || game.currentPlayerName != username}
              value={sentenceInput}
              onKeyUp={handleSentenceSubmit}
            />
            <p className="err">{addSentenceError}</p>
          </div>
        )}
      </div>
      <GameResultsModal showModal={showResultsModal} />
    </div>
  );
};

export default GameBoard;
