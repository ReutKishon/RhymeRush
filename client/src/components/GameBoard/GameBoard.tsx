import { useEffect, useState } from "react";
import { PlayerList, SentenceInput, SongLyrics, StartGameButton } from "./";
import { useParams } from "react-router-dom";
import useSocketEvents from "../../hooks/useSocketEvents";
import { api } from "../../services/index";
import useAppStore from "../../store/useStore";
import { Box } from "@mui/material";
import GameResultsModal from "./modals/GameResultsModal";
import GameTimer from "./GameTimer";

const GameBoard = () => {
  const { gameCode } = useParams<{ gameCode: string }>();
  const { setGame, setGameCode, resetGame } = useAppStore((state) => state);
  const [topic, setTopic] = useState<string>();
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
          setGameCode(gameCode); //TODO: remove gameCode state and use the field in game
          setTopic(game.topic);
        }
      } catch (err) {
        console.error("Failed to fetch game details: ", err);
      }
    };
    resetGame();
    fetchGame();
  }, [gameCode]);

  useSocketEvents({ setShowResultsModal });

  return (
    <div className="h-screen flex flex-col p-20">
      <div
        className="flex items-center justify-around">
        <p className="text-2xl font-extrabold w-full text-center mb-4 ml-10">
          {topic}
        </p>
        <GameTimer setShowResultsModal />
      </div>

      <div className="flex w-full h-full">
        <SongLyrics />
        <PlayerList />
      </div>



      <div className="w-full flex justify-center">
        {!game.isActive && username == game.gameCreatorName && <StartGameButton />}
        {game.isActive && <div className="w-2/3">
          <SentenceInput />
        </div>}
      </div>




      <GameResultsModal showModal={showResultsModal} />
    </div>
  );
};

export default GameBoard;
