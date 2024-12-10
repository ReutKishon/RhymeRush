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

const GameBoard = () => {
  const { gameCode } = useParams<{ gameCode: string }>();
  const { setGame } = useAppStore((state) => state);

  const [showGameOverModal, setShowGameOverModal] = useState(false);
  const [loosingReason, setLoosingReason] = useState("");
  const [showWinningModal, setShowWinningModal] = useState(false);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        if (gameCode) {
          const game = await api.fetchGameData(gameCode);
          setGame(game);
        }
      } catch (err) {
        console.error("Failed to fetch game details: ", err);
      }
    };
    fetchGame();
  }, [gameCode]);

  useSocketEvents({
    gameCode: gameCode!,
    setShowGameOverModal,
    setLoosingReason,
    setShowWinningModal,
  });
  return (
    <div className="relative h-screen p-4">
      <div className="absolute top-10 inset-x-0 flex items-center justify-between px-4">
        <Topic />
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center -mt-14">
        <SongLyrics />
      </div>
      <div className="absolute right-20 top-20">
        <PlayerList />
      </div>
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 mb-4">
        <SentenceInput />
        <StartGameButton />
      </div>
      {showGameOverModal && (
        <GameOverModal
          setShowModal={setShowGameOverModal}
          reason={loosingReason}
        />
      )}
      {showWinningModal && <GameEndModal setShowModal={setShowWinningModal} />}
    </div>
  );
};

export default GameBoard;
