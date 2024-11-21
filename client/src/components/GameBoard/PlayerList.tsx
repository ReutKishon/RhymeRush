import React, { useEffect, useState } from "react";
import socket from "../../services/socket.ts";

import { Player } from "../../../../shared/types/gameTypes";

interface PlayerListProps {
  initialPlayers: Player[];
}

const PlayerList: React.FC<PlayerListProps> = ({ initialPlayers }) => {
  const [players, setPlayers] = useState<Player[]>(initialPlayers);

  useEffect(() => {
    // Listen for new players joining the game
    socket.on("playerJoined", (newPlayer: Player) => {
      console.log("Player joined with id: " + newPlayer.id);
      setPlayers((prevPlayers) => [...prevPlayers, newPlayer]);
    });

    // Listen for players leaving the game
    socket.on("playerLeft", (leftPlayerId: string) => {
      console.log("Player left");
      setPlayers((prevPlayers) =>
        prevPlayers.filter((player) => player.id !== leftPlayerId)
      );
    });

    return () => {
      socket.off("playerJoined");
      socket.off("playerLeft");
    };
  }, []);

  return (
    <div className="player-list">
      <h2>Players in the Game</h2>
      <ul>
        {players.map((player) => (
          <li key={player.id}>{player.id}</li>
        ))}
      </ul>
    </div>
  );
};

export default PlayerList;
