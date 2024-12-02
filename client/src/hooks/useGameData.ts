import { useQuery } from "react-query";
import { api } from "../services";
import useStore from "../store/useStore";

const useGameData = () => {
  const gameCode = useStore((state) => state.gameCode);

  return useQuery(["game", gameCode], () => api.fetchGameData(gameCode), {
    enabled: !!gameCode,
  });
};

export default useGameData;