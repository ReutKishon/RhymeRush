import React, { useEffect, useState } from "react";
import { PlayerList, SentenceInput, SongLyrics, StartGameButton } from "./";
import { useParams } from "react-router-dom";
import useSocketEvents from "../../hooks/useSocketEvents";
import { api } from "../../services/index";
import useAppStore from "../../store/useStore";
import { Box } from "@mui/material";
import GameResultsModal from "./modals/GameResultsModal";
import GameTimer from "./GameTimer";
// import LosingAlert from "./modals/LosingAlert.tsx";

const GameBoard = () => {
  const { gameCode } = useParams<{ gameCode: string }>();
  const { setGame, setGameCode, resetGame } = useAppStore((state) => state);
  const [topic, setTopic] = useState<string>();

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
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Top Section - Start Button and Topic */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 3,
        }}
      >
        <h2
          className="text-l sm:text-2xl text-center mb-4 ml-10"
          style={{ fontWeight: "bold", width: "90%" }}
        >
          {topic}
        </h2>
        <StartGameButton />
        <GameTimer setShowResultsModal />
      </Box>
      {/* Middle Section - SongLyrics (Centered in the middle of the page) */}
      <div className="flex-1 flex flex-col sm:flex-row items-center gap-4">
        <div className="flex-shrink-0 flex-grow-0 basis-[10%]">
          <PlayerList />
        </div>
        <div className="flex basis-[90%] flex items-center justify-center max-h-[400px] h-full mt-10">
          <SongLyrics />
        </div>
      </div>
      {/* Bottom Section - Sentence Input */}
      <Box
        sx={{
          marginTop: 10,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: 12,
        }}
      >
        <SentenceInput />
      </Box>

      {/* <LosingAlert /> */}

      <GameResultsModal showModal={showResultsModal} />
    </Box>
  );
};

export default GameBoard;
