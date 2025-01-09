import { useEffect, useState } from "react";
import { Players, SongLyrics } from "./";
import { useParams } from "react-router-dom";
import useSocketEvents from "../../hooks/useSocketEvents";
import useAppStore from "../../store/useStore";
import GameResultsModal from "./modals/GameResultsModal";
import GameTimer from "./GameTimer";
import { socket, api } from "../../services";

const GameBoard = () => {
  const { gameCode } = useParams<{ gameCode: string }>();
  const [sentenceInput, setSentenceInput] = useState<string>("");
  const [error, setError] = useState<string>("");

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

  useSocketEvents({ setShowResultsModal });

  const onStartGamePress = () => {
    socket.emit("startGame");
  };

  const handleSentenceSubmit = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key !== "Enter") return;
    const trimmedSentence = sentenceInput.trim();
    if (trimmedSentence === "") {
      setError("Sentence cannot be empty.");
      return;
    }

    try {
      console.log("Emitting sentence:", trimmedSentence);
      socket.emit("addSentence", trimmedSentence);
      setSentenceInput("");
      setError("");
    } catch (err) {
      console.error("Error sending sentence:", err);
      setError("Failed to send sentence. Please try again.");
    }
  };

  return (
    <div className="h-screen p-10">
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
          <button onClick={onStartGamePress} className="btn w-40 bg-[#c7f5a4]">
            <h3 className="text-center">Start</h3>
          </button>
        )}
        {game.isActive && (
          <input
            placeholder="Type a new line"
            onChange={(e) => setSentenceInput(e.target.value)}
            disabled={!game.isActive || game.currentPlayerName != username}
            value={sentenceInput}
            onKeyUp={handleSentenceSubmit}
          />
        )}
      </div>
      <GameResultsModal showModal={showResultsModal} />
    </div>
  );
};

export default GameBoard;
