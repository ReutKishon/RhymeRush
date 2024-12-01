import React from "react";
import {useGameData} from "../../hooks";

const SongLyrics = () => {
  const { data: game } = useGameData();


  return (
    <div className="h-96 w-100 max-w-4xl overflow-y-auto scrollbar-hidden space-y-6 px-4">
      {game?.lyrics?.map((sentence, index) => (
        <p className="text-black font-bold text-xl" key={index}>
          {sentence.player?.username}: {sentence.content}
        </p>
      ))}
    </div>
  );
};

export default SongLyrics;
