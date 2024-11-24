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
    <h2>Game Info</h2>
    <h2>{modalMessage}</h2>
    <ul>
      <li key={1}>Game Code: {game.gameCode}</li>
      <li key={2}>Game Started: {game.isStarted ? "Yes" : "No"}</li>
      <li key={3}>Topic: {game.topic}</li>
      <li key={4}>Current Turn: {turn?.username}</li>
    </ul>
    <PlayerList initialPlayers={game.players} />
    {/* <SentenceInput gameCode={game.gameCode} />
    <SongLyrics initialLyrics={game.lyrics} /> */}
  </div>
  );
};

export default GameBoard;
