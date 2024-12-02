import React, { useEffect } from "react";
import {
  PlayerList,
  SentenceInput,
  SongLyrics,
  StartGameButton,
  Topic,
} from "./";
import { useParams } from "react-router-dom";
import useSocketEvents from "../../hooks/useSocketEvents.ts";
import useStore from "../../store/useStore.ts";
import GameEndModal from "./modals/GameEndModal.tsx";
import { fetchGameData } from "../../services/api.ts";

const GameBoard = () => {
  const { gameCode } = useParams<{ gameCode: string }>();
  
  

  useSocketEvents(gameCode!);

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
      <GameEndModal />
      {/* <PlayerLeftModal isVisible={isPlayerLeft} leftPlayer={leftPlayerId!} /> */}
    </div>
  );
};

export default GameBoard;
