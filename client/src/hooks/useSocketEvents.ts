import { useEffect } from "react";
import { useQueryClient } from "react-query";
import socket from "../services/socket";
import { Game, Player, Sentence } from "../../../shared/types/gameTypes";

const useSocketEvents = (gameCode: string) => {
  const queryClient = useQueryClient();

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

    socket.on("playerLeft", (playerId) => {
      queryClient.setQueryData<Game | undefined>(
        ["gameData", gameCode],
        (oldData: Game | undefined) => {
          if (!oldData) return undefined;

          return {
            ...oldData,
            players: oldData.players.filter(
              (player: Player) => player.id !== playerId
            ),
          };
        }
      );
    });

    socket.on("updatedTurn", (newTurn: number) => {
      queryClient.setQueryData<Game | undefined>(
        ["gameData", gameCode],
        (oldData: Game | undefined) => {
          if (!oldData) return undefined;

          return { ...oldData, currentTurn: newTurn };
        }
      );
    });

    socket.on("updatedLyrics", (newSentence: Sentence) => {
      queryClient.setQueryData<Game | undefined>(
        ["gameData", gameCode],
        (oldData: Game | undefined) => {
          if (!oldData) return undefined;

          return { ...oldData, lyrics: [...oldData.lyrics, newSentence] };
        }
      );
    });

    return () => {
      socket.off("playerJoined");
      socket.off("updatedTurn");
      socket.off("updatedLyrics");
    };
  }, [gameCode, queryClient]);
};

export default useSocketEvents;
