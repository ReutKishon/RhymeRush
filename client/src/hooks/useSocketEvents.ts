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

    // socket.on("updatedLyrics", (newSentence: Sentence) => {
    //   queryClient.setQueryData<Game | undefined>(
    //     ["gameData", gameCode],
    //     (oldData: Game | undefined) => {
    //       if (!oldData) return undefined;

    //       return { ...oldData, lyrics: [...oldData.lyrics, newSentence] };
    //     }
    //   );
    // });

    // socket.on("gameEnd", (winner: Player) => {
    //   console.log("gameEnd", winner);

    //   queryClient.setQueryData<Game | undefined>(
    //     ["gameData", gameCode],
    //     (oldData: Game | undefined) => {
    //       if (!oldData) return undefined;

    //       return { ...oldData, winner };
    //     }
    // //   );
    // });

    return () => {
      socket.off("playerJoined");
      socket.off("gameUpdated");

      // socket.off("updatedTurn");
      // socket.off("updatedLyrics");
      // socket.off("gameEnd");
      // socket.off("playerLeft");
    };
  }, [gameCode]);
};

export default useSocketEvents;
