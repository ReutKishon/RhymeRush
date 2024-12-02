import { useEffect } from "react";
import socket from "../services/socket";
import { Game, Player } from "../../../shared/types/gameTypes";
import queryClient from "../services/queryClient";
const useSocketEvents = (gameCode: string) => {
  useEffect(() => {
    socket.on("playerJoined", (player: Player) => {
      queryClient.setQueryData<Game | undefined>(
        ["game", gameCode],
        (oldData: Game | undefined) => {
          if (!oldData) return undefined;

          return { ...oldData, players: [...oldData.players, player] };
        }
      );
    });

    socket.on("gameUpdated", () => {
      console.log("gameUpdated");
      queryClient.invalidateQueries(["game", gameCode]);
    });

    return () => {
      socket.off("playerJoined");
      socket.off("gameUpdated");
    };
  }, [gameCode]);
};

export default useSocketEvents;
