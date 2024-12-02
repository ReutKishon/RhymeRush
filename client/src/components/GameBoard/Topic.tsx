import React from "react";
import { useGameData } from "../../hooks";

const Topic = () => {
  const { data: game } = useGameData();

  return (
    
    <h2 className="text-2xl font-bold text-center w-full">{game?.topic}</h2>
  );
};

export default Topic;
