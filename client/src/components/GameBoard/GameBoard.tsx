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
import { useTranslations } from "../../hooks/useTranslations";

const GameBoard = () => {
  const t = useTranslations();
  const { gameCode } = useParams<{ gameCode: string }>();
  const [sentenceInput, setSentenceInput] = useState<string>("");
  const [addSentenceError, setAddSentenceError] = useState<string>("");
  const [isCopied, setIsCopied] = useState(false);
  const [aiPlayerButtonText, setAIPlayerButtonText] = useState(
    t.game.createAIPlayer
  );

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
    if (game.players.length == 1) return;
    socket.emit("startGame");
  };

  const handleSentenceSubmit = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key !== "Enter") return;
    const trimmedSentence = sentenceInput.trim();
    if (trimmedSentence === "") {
      setAddSentenceError(t.game.pleaseEnterSomething);
      return;
    }

    socket.emit("addSentence", trimmedSentence);
    setSentenceInput("");
    setAddSentenceError("");
  };

  const handleCodeCopy = () => {
    navigator.clipboard.writeText(game.code).then(
      () => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      },
      (err) => console.error("Failed to copy: ", err)
    );
  };

  const handleAIPlayerButton = () => {
    if (aiPlayerButtonText == t.game.createAIPlayer) {
      socket.emit("addAIPlayer");
      setAIPlayerButtonText(t.game.RemoveAIPlayer);
    } else {
      socket.emit("removeAIPlayer");
      setAIPlayerButtonText(t.game.createAIPlayer);
    }
  };

  return (
    <div className="relative flex flex-col h-screen bg-primary-purple">
      {/* Header Section */}
      <div className="flex justify-between items-center p-4">
        <GameTimer />
        <ExitButton />
      </div>

      {/* Topic/Title Section */}
      <div className="text-center py-2">
        <h1 className="font-bold">{game.topic}</h1>
      </div>

      {/* Main Content Section - Using grid for desktop */}
      <div className="flex-1 flex flex-col gap-4 p-4 overflow-hidden">
        {/* Players Section - Row on mobile, Column on desktop */}
        <Players
          players={game.players}
          gameIsActive={game.isActive}
          currentPlayerName={game.currentPlayerName}
        />

        {/* Center Content - Game Code or Lyrics */}
        <div className="flex-1 overflow-y-scroll scrollbar-hide">
          {!game.isActive ? (
            <div className="flex flex-col items-center justify-center gap-4 h-full">
              <h3 className="text-center">{t.game.shareCode}</h3>
              <div className="bg-primary-yellow rounded-xl py-4 px-8 flex items-center gap-4">
                <span className="text-2xl font-bold">{game.code}</span>
                <i
                  onClick={handleCodeCopy}
                  className="material-icons cursor-pointer"
                >
                  {isCopied ? "check" : "content_copy"}
                </i>
              </div>
              {username === game.gameCreatorName ? (
                <div className="flex flex-col gap-4">
                  <h3 className="text-center">{t.game.addAIPlayerTitle}</h3>
                  <button
                    onClick={handleAIPlayerButton}
                    className="bg-white rounded-xl py-4 px-8 flex items-center gap-4"
                  >
                    <p className="text-xl">{aiPlayerButtonText}</p>
                  </button>
                </div>
              ) : (
                <p className="text-red-500">{t.game.waitingPlayers}</p>
              )}
            </div>
          ) : (
            <div className="h-full w-full">
              <SongLyrics lyrics={game.lyrics} />
            </div>
          )}
        </div>
      </div>

      {/* Input Section */}
      <div className="p-4 ">
        {!game.isActive && username === game.gameCreatorName && (
          <button
            onClick={onStartGamePress}
            className="bg-primary-yellow w-full py-3 rounded-xl"
          >
            {t.game.startGame}
          </button>
        )}

        {game.isActive && (
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <input
                className="bg-primary-yellow rounded-xl py-3 px-4"
                placeholder={t.game.typeLine}
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
                disabled={
                  !game.isActive ||
                  game.currentPlayerName !== username ||
                  !sentenceInput.trim()
                }
                className={`bg-primary-green rounded-lg w-24
                  ${
                    !game.isActive ||
                    game.currentPlayerName !== username ||
                    !sentenceInput.trim()
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-primary-pink transition-colors"
                  }`}
              >
                {/* if rtl */}
                {document.documentElement.dir === "rtl" ? "←" : "→"}
              </button>
            </div>
          </div>
        )}
      </div>

      <GameResultsModal showModal={showResultsModal} />
    </div>
  );
};

export default GameBoard;
