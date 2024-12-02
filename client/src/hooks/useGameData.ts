import { useQuery } from "react-query";
import { fetchGameData } from "../services/api";
import useStore from "../store/useStore";

const useGameData = () => {
  const gameCode = useStore((state) => state.gameCode);

  return useQuery(["game", gameCode], () => fetchGameData(gameCode), {
    enabled: !!gameCode,
  });
};

export default useGameData;
