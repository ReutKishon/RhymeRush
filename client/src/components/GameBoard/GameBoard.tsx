import React, { useEffect, useState } from "react";
import axios from "axios";
import { Game, Player } from "../../../../shared/types/gameTypes";
import PlayerList from "./PlayerList.tsx";
import { useParams } from "react-router-dom";
import SentenceInput from "./SentenceInput.tsx";
import SongLyrics from "./SongLyrics.tsx";
import socket from "../../services/socket.ts";

const GameBoard: React.FC = () => {
  const { gameCode } = useParams<{ gameCode: string }>();
  const [game, setGame] = useState<Game | null>(null);
  const [turn, setTurn] = useState<Player>();
  const [modalMessage, setModalMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/game/${gameCode}`
        );
        const gameData: Game = response.data.data.gameData;
        console.log("gameData: ", response);

        setGame(gameData);
        console.log("turn: ", gameData.currentTurn);
        setTurn(gameData.players[gameData.currentTurn]);
      } catch (err) {
        setError(`Failed to fetch game details: ${err.message}`);
      }
    };

    fetchGame();
    socket.on("updatedTurn", (currentTurnPlayer: Player) => {
      setTurn(currentTurnPlayer);
    });
    socket.on("gameEnd", (winner: Player) => {
      setModalMessage(`game over. The winner is ${winner.username}`);
    });
    socket.on("playerLost", (lostPlayer: Player) => {
      setModalMessage(
        `${lostPlayer.username} lost and left the game. continue the game`
      );
    });
    return () => {
      socket.off("updatedTurn");
      socket.off("gameEnd");
      socket.off("playerLost");
    };
  }, [gameCode]);

  if (error) {
    return <div>Error: {error}</div>; // Display an error message if fetching fails
  }

  if (!game) {
    return <div>Loading...</div>; // Display a loading message until the game data is available
  }

  return (
    <div className="relative h-screen p-4">
      <div className="absolute top-10 inset-x-0 flex items-center justify-center">
        <h2 className="text-2xl font-bold">Topic: {game.topic}</h2>
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center -mt-14">
        <SongLyrics initialLyrics={game.lyrics} />
      </div>

      <div className="absolute right-20 top-20">
        <PlayerList initialPlayers={game.players} />
      </div>

      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 mb-4">
        <SentenceInput gameCode={game.gameCode} />
      </div>
    </div>
  );
};

export default GameBoard;
