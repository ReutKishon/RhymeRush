import React from "react";
import useAppStore from "../../store/useStore";

const SongLyrics = () => {
  const { game } = useAppStore((state) => state);

  return (
    <div className="h-96 w-100 max-w-4xl overflow-y-auto scrollbar-hidden space-y-6 px-4">
      {game.lyrics.map((sentence, index) => (
        <p className="text-black font-bold text-xl" key={index}>
          {game.players[sentence.playerId]?.name}: {sentence.content}
        </p>
      ))}
    </div>
  );
};

export default SongLyrics;
