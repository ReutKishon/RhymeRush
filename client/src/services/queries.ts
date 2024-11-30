import { useQuery } from "react-query";
import useStore from "../store/useStore";
import { Game, Sentence } from "../../../shared/types/gameTypes";
import { getGameData } from "./api";

import queryClient from "../services/queryClient";

export const useGameData = () => {
  const gameCode = useStore((state) => state.gameCode);
  console.log("gameCode: " + gameCode);
  return useQuery<Game>(["gameData", gameCode], () => getGameData(gameCode!), {
    enabled: !!gameCode, // Ensure the query only runs if gameCode exists
  });
};


