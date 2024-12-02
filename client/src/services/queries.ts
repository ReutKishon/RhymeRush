// import { useQuery } from "react-query";
// import { Game, Sentence } from "../../../shared/types/gameTypes";
// import { getGameData } from "./api";
// import useStore from "../store/useStore";


// export const useGameData = () => {
//   const gameCode = useStore((state) => state.gameCode);
//   return useQuery<Game>(["gameData", gameCode], () => getGameData(gameCode!), {
//     enabled: !!gameCode, // Ensure the query only runs if gameCode exists
//   });
// };


