import React, { useEffect } from "react";
import socket from "../../services/socket.ts";

import { Player } from "../../../../shared/types/gameTypes";
import PlayerAvatar from "./PlayerAvatar.tsx";
import useGameStore from "../../store/gameStore.ts";

// interface PlayerListProps {
//   initialPlayers: Player[];
// }
const PlayerList: React.FC = () => {
  const { players, addPlayer, removePlayer, currentTurn, setGameEnd } =
    useGameStore();

  useEffect(() => {
    // Listen for new players joining the game
    socket.on("playerJoined", (newPlayer: Player) => {
      addPlayer(newPlayer);
    });

    // Listen for players leaving the game
    socket.on("playerLeft", (leftPlayerId: string) => {
      removePlayer(leftPlayerId);
    });

    return () => {
      socket.off("playerJoined");
      socket.off("playerLeft");
    };
  }, [addPlayer, removePlayer]);

  return (
    <div className="flex flex-col space-y-8 p-4">
      {players.map((player, index) => (
        <PlayerAvatar
          key={index}
          username={player.username}
          playerColor={player.color}
          showAnimation={currentTurn?.id === player.id}
          setIsGameOver={setGameEnd}
        />
      ))}
    </div>
  );
};

export default PlayerList;
