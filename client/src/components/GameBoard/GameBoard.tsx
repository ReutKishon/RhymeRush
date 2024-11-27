import React, { useEffect } from "react";
import { Player, Sentence } from "../../../../shared/types/gameTypes";
import PlayerList from "./PlayerList.tsx";
import { useParams } from "react-router-dom";
import SentenceInput from "./SentenceInput.tsx";
import SongLyrics from "./SongLyrics.tsx";
import socket from "../../services/socket.ts";
import StartGameButton from "./StartGameButton.tsx";
import GameOverModal from "./GameOverModal.tsx";
import useUserStore from "../../store/userStore.ts";
import useFetchGame from "../../hooks/useFetchGame.ts";
import useGameStore from "../../store/gameStore.ts";

const GameBoard: React.FC = () => {
  const { gameCode } = useParams<{ gameCode: string }>();
  const { game, error } = useFetchGame(gameCode);
  const {
    setGameCode,
    currentTurn,
    isGameEnd,
    winner,
    setCurrentTurn,
    setGameEnd,
    setWinner,
    setPlayers,
    players,
    setGameCreatorId,
  } = useGameStore();

  const { userId } = useUserStore((state) => state);

  useEffect(() => {
    if (!game) {
      return;
    }
    setGameCode(game.gameCode);
    setPlayers(game.players);
    setGameCreatorId(game.gameCreatorId);

    socket.on("updatedTurn", (currentTurnPlayer: Player) => {
      setCurrentTurn(currentTurnPlayer);
    });
    socket.on("gameEnd", (winner: Player, finalSongLyrics: Sentence[]) => {
      setGameEnd(true);
      setWinner(winner);
    });

    socket.on("playerLost", (lostPlayer: Player) => {});
    return () => {
      socket.off("updatedTurn");
      socket.off("gameEnd");
      socket.off("playerLost");
    };
  }, [game, setGameEnd, setWinner, setCurrentTurn]);

  const handleSaveSong = () => {
    console.log("saveSong");
  };

  if (error) {
    return <div>Error: {error}</div>; // Display an error message if fetching fails
  }

  if (!game) {
    return <div>Loading...</div>; // Display a loading message until the game data is available
  }

  return (
    <div className="relative h-screen p-4">
      <div className="absolute top-10 inset-x-0 flex items-center justify-between px-4">
        {/* Topic */}
        <h2 className="text-2xl font-bold text-center w-full">
          Topic: {game.topic}
        </h2>
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center -mt-14">
        <SongLyrics />
      </div>

      <div className="absolute right-20 top-20">
        <PlayerList />
      </div>

      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 mb-4">
        <SentenceInput
          gameCode={game.gameCode}
          isPlayerTurn={currentTurn?.id === userId}
          setIsGameEnd={setGameEnd}
        />
        <StartGameButton />
      </div>
      <GameOverModal
        isVisible={isGameEnd}
        winnerName={winner?.username}
        handleSaveSong={handleSaveSong}
      />
    </div>
  );
};

export default GameBoard;
