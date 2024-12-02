import { useEffect } from "react";
import socket from "../services/socket";
import { Game, Player, Sentence } from "../../../shared/types/gameTypes";
import queryClient from "../services/queryClient";
const useSocketEvents = (gameCode: string) => {
  useEffect(() => {
    socket.on("playerJoined", (player: Player) => {
      queryClient.setQueryData<Game | undefined>(
        ["gameData", gameCode],
        (oldData: Game | undefined) => {
          if (!oldData) return undefined;

          return { ...oldData, players: [...oldData.players, player] };
        }
      );
    });

    socket.on("gameUpdated", () => {
      queryClient.invalidateQueries(["gameData", gameCode]);
    });

    return () => {
      socket.off("playerJoined");
      socket.off("gameUpdated");
    };
  }, [gameCode]);
};

export default useSocketEvents;
