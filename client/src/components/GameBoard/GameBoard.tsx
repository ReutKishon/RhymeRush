import React, { useEffect, useState } from "react";
import { PlayerList, SentenceInput, SongLyrics, StartGameButton } from "./";
import { useParams } from "react-router-dom";
import useSocketEvents from "../../hooks/useSocketEvents.ts";
import GameOverModal from "./modals/GameOverModal.tsx";
import { api } from "../../services/index.ts";
import useAppStore from "../../store/useStore.ts";
import { Box } from "@mui/material";
import useGameOverModal from "../../hooks/useGameOverModal.ts";
import GameResultsModal from "./modals/GameResultsModal.tsx";

const GameBoard = () => {
  const { gameCode } = useParams<{ gameCode: string }>();
  const { setGame, setGameCode, game } = useAppStore((state) => state);
  const [showResultsModal, setShowResultsModal] = useState<boolean>(false);

  // const {
  //   showGameOverModal,
  //   losingPlayerName,
  //   losingReason,
  //   triggerGameOverModal,
  //   hideGameOverModal,
  // } = useGameOverModal();

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
          className="text-2xl text-center mb-4 ml-20"
          style={{ fontWeight: "bold", width: "90%" }}
        >
          {game.topic}
        </h2>
        <StartGameButton />
      </Box>
      {/* Middle Section - SongLyrics (Centered in the middle of the page) */}
      <Box
        sx={{
          flex: 1, // Allow the middle section to take the remaining space
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <PlayerList />
        <SongLyrics />
      </Box>
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

      <GameResultsModal showModal={showResultsModal} />
    </Box>
  );
};

export default GameBoard;
