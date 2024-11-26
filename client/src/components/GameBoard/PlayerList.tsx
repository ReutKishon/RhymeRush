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
    <div className="flex flex-col space-y-8 p-4">
      {players.map((player, index) => (
        <PlayerAvatar
          key={index}
          username={player.username}
          playerColor={player.color}
        />
      ))}
    </div>
  );
};

export default PlayerList;
