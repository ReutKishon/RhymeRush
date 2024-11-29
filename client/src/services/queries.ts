import { useQuery, useMutation, useQueryClient } from "react-query";
import useStore from "../store/useStore";
import { Game, Player } from "../../../shared/types/gameTypes";
import {
  addPlayer,
  addSentence,
  getCurrentTurn,
  getGameData,
  getLyrics,
  getPlayers,
  removePlayer,
} from "./api";
import useUserStore from "../store/userStore";
import socket from "./socket";

// export const useUser = () => {
//     const setUser = useStore((state) => state.setUser);

//     return useMutation(
//       (userId: string) => {
//         return getUser(userId);
//       },
//       {
//         onSuccess: (data) => {
//           setUser(data);
//         },
//       }
//     );
//   };

export const useGameData = () => {
  const gameCode = useStore((state) => state.gameCode);
  console.log("gameCode: " + gameCode);
  return useQuery<Game>(
    ["gameData", gameCode],
    () => getGameData(gameCode!),
    {
      enabled: !!gameCode, // Ensure the query only runs if gameCode exists
    }
  );
};

// export const usePlayers = () => {
//   const gameCode = useStore((state) => state.gameCode);
//   return useQuery("players", () => getPlayers(gameCode!));
// };
// export const useAddPlayer = () => {
//   const queryClient = useQueryClient();

//   return useMutation(
//     ({
//       gameCode,
//       joinedPlayerId,
//     }: {
//       gameCode: string;
//       joinedPlayerId: string;
//     }) => {
//       return addPlayer(gameCode, joinedPlayerId);
//     },
//     {
//       onSuccess: () => {
//         queryClient.invalidateQueries("players");
//       },
//     }
//   );
// };

// export const useRemovePlayer = () => {
//   const gameCode = useStore((state) => state.gameCode);

//   const queryClient = useQueryClient();
//   return useMutation(
//     (playerId: string) => {
//       return removePlayer(gameCode!, playerId);
//     },
//     {
//       onSuccess: () => {
//         queryClient.invalidateQueries("players");
//       },
//     }
//   );
// };

// export const useLyrics = () => {
//   const gameCode = useStore((state) => state.gameCode);
//   return useQuery("lyrics", () => getLyrics(gameCode!));
// };

// export const useCurrentTurn = () => {
//   const gameCode = useStore((state) => state.gameCode);
//   return useQuery("currentTurn", () => getCurrentTurn(gameCode!));
// };

// export const useAddSentence = () => {
//   const gameCode = useStore((state) => state.gameCode);
//   const { userId } = useUserStore((state) => state);

//   return useMutation(
//     (sentence: string) => {
//       return addSentence(gameCode!, sentence, userId);
//     },
//     {
//       onSuccess: (data) => {
//         if (!data.sentenceIsValid) {
//           socket.emit("leaveGame", gameCode, userId);
//         } else {
//           socket.emit("addSentence", gameCode, data.data.gameData.lyrics[-1]);
//         }
//         socket.emit("updateTurn", gameCode, data.data.gameData.currentTurn);
//       },
//     }
//   );
// };
