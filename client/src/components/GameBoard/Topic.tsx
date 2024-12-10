import React from "react";
import useAppStore from "../../store/useStore";

const Topic = () => {
  const { game } = useAppStore((state) => state);

  return (
    <h2 className="text-2xl font-bold text-center w-full">{game.topic}</h2>
  );
};

export default Topic;
