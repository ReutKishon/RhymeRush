import React, { useEffect, useState } from "react";
import {
  PlayerList,
  SentenceInput,
  SongLyrics,
  StartGameButton,
  Topic,
} from "./";
import { useParams } from "react-router-dom";
import useSocketEvents from "../../hooks/useSocketEvents.ts";
import GameOverModal from "./modals/GameOverModal.tsx";
import { api } from "../../services/index.ts";
import useAppStore from "../../store/useStore.ts";
import GameEndModal from "./modals/GameEndModal.tsx";
import { Box } from "@mui/material";
import useGameOverModal from "../../hooks/useGameOverModal.ts";

const GameBoard = () => {
  const { gameCode } = useParams<{ gameCode: string }>();
  const { setGame, setGameCode } = useAppStore((state) => state);

  const {
    showGameOverModal,
    losingPlayerName,
    losingReason,
    triggerGameOverModal,
    hideGameOverModal,
  } = useGameOverModal();

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

  useSocketEvents({ triggerGameOverModal });
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
        <Topic />
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
      <GameOverModal
        show={showGameOverModal}
        player={losingPlayerName}
        reason={losingReason}
        onClose={hideGameOverModal}
      />
    </Box>
  );
};

export default GameBoard;
