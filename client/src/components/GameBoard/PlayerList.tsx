import React, { useEffect, useState } from "react";
import socket from "../../services/socket.ts";

import { Player } from "../../../../shared/types/gameTypes";
import PlayerAvatar from "./PlayerAvatar.tsx";

interface PlayerListProps {
  initialPlayers: Player[];
}

const PlayerList: React.FC<PlayerListProps> = ({ initialPlayers }) => {
  const [players, setPlayers] = useState<Player[]>(initialPlayers);

  useEffect(() => {
    // Listen for new players joining the game
    socket.on("playerJoined", (newPlayer: Player) => {
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
    <div className="absolute right-0 top-0 flex flex-col space-y-4 p-4">
    {players.map((player, index) => (
      <PlayerAvatar key={index} username={player.username} />
    ))}
  </div>
  );
};

export default PlayerList;
