import React, { useEffect, useState } from "react";
import { socket } from "../../services/socket";

import { Player } from "../../../../shared/types/gameTypes";

interface PlayerListProps {
  initialPlayers: Player[]; // Receive initial player list as a prop
}

const PlayerList: React.FC<PlayerListProps> = ({ initialPlayers }) => {
  const [players, setPlayers] = useState<Player[]>(initialPlayers);

  useEffect(() => {
    // Listen for new players joining the game
    socket.on("playerJoined", (newPlayer: Player) => {
      setPlayers((prevPlayers) => [...prevPlayers, newPlayer]);
    });

    // Clean up the socket listener on component unmount
    return () => {
      socket.off("playerJoined");
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
