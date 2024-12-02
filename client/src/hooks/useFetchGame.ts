import { useState, useEffect } from "react";
import axios from "axios";
import { Game } from "../../../shared/types/gameTypes";

const useFetchGame = (gameCode: string) => {
  const [game, setGame] = useState<Game | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!gameCode) {
      setError("Game code is not provided.");
      return;
    }

    const fetchGame = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/game/${gameCode}`
        );
        setGame(response.data.data.gameData);
      } catch (err: any) {
        setError(err.message || "An error occurred");
      }
    };

    fetchGame();
  }, [gameCode]);

  return { game, error };
};

export default useFetchGame;
