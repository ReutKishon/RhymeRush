import React, { useEffect, useState } from "react";
import axios from "axios";
import { Game, Player } from "../../../../shared/types/gameTypes";
import PlayerList from "./PlayerList.tsx";
import { useParams } from "react-router-dom";

const GameBoard: React.FC = () => {
  const { gameCode } = useParams<{ gameCode: string }>();
  const [game, setGame] = useState<Game | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/game/${gameCode}`
        );
        console.log("response: ", response);
        const gameData: Game = response.data.data.gameData;
        console.log("gameData: ", response);

        setGame(gameData);
      } catch (err) {
        setError(`Failed to fetch game details: ${err.message}`);
      }
    };

    fetchGame();
  }, [gameCode]);

  if (error) {
    return <div>Error: {error}</div>; // Display an error message if fetching fails
  }

  if (!game) {
    return <div>Loading...</div>; // Display a loading message until the game data is available
  }

  return (
    <div className="player-list">
      <h2>Game Info</h2>
      <ul>
        <li key={1}>Game Code: {game.gameCode}</li>
        <li key={2}>Game Started: {game.isStarted ? "Yes" : "No"}</li>
        <li key={3}>Topic: {game.topic}</li>
        <h3>Players</h3>
        <PlayerList initialPlayers={game.players} />
      </ul>
    </div>
  );
};

export default GameBoard;
