import React, { useEffect, useState } from "react";
import PlayerList from "./PlayerList.tsx";
import { useParams } from "react-router-dom";
import SentenceInput from "./SentenceInput.tsx";
import SongLyrics from "./SongLyrics.tsx";
import StartGameButton from "./StartGameButton.tsx";
import { useGameData } from "../../services/queries.ts";
import useStore from "../../store/useStore.ts";
import useSocketEvents from "../../hooks/useSocketEvents.ts";
import useUserStore from "../../store/userStore.ts";
import GameEndModal from "./modals/GameEndModal.tsx";

const GameBoard: React.FC = () => {
  const { gameCode } = useParams<{ gameCode: string }>();
  const { userId } = useUserStore((state) => state);
  const setGameCode = useStore((state) => state.setGameCode);

  useEffect(() => {
    if (gameCode) {
      setGameCode(gameCode); // Set gameCode in the store
    }
  }, [gameCode]);

  useSocketEvents(gameCode!);
  const { data: game, error, isLoading } = useGameData();

  console.log("Game winner: ", game?.winner);

  if (error) {
    return <div>`Error</div>; // Display an error message if fetching fails
  }

  if (isLoading) {
    return <div>Loading...</div>; // Display a loading message until the game data is available
  }

  return (
    <div className="relative h-screen p-4">
      <div className="absolute top-10 inset-x-0 flex items-center justify-between px-4">
        <h2 className="text-2xl font-bold text-center w-full">
          Topic: {game?.topic}
        </h2>
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center -mt-14">
        <SongLyrics lyrics={game?.lyrics!} />
      </div>
      <div className="absolute right-20 top-20">
        <PlayerList players={game?.players!} currentTurn={game?.currentTurn!} />
      </div>
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 mb-4">
        <SentenceInput
          isUserTurn={
            game?.currentTurn != -1 &&
            game?.players![game.currentTurn!]?.id === userId
          }
        />
        <StartGameButton
          gameCreatorId={game?.gameCreatorId!}
          isStarted={game?.isActive!}
        />
      </div>
      {game?.winner && <GameEndModal winner={game.winner} />}
      {/* <PlayerLeftModal isVisible={isPlayerLeft} leftPlayer={leftPlayerId!} /> */}
    </div>
  );
};

export default GameBoard;
