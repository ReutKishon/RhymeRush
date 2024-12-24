import React, { useEffect, useRef } from "react";
import useAppStore from "../../store/useStore";

const SongLyrics = () => {
  const { game } = useAppStore((state) => state);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [game.lyrics]);

  return (
    <div className="flex flex-col w-full h-full overflow-hidden justify-center items-center">
      <div
        ref={scrollRef}
        className="overflow-y-auto scrollbar-hide w-full h-full text-center"
      >
        {game.lyrics.map((sentence, index) => (
          <p key={index} className="text-black font-bold text-xl mb-2">
            {game.players.find((p) => p.id === sentence.playerId)?.name}:{" "}
            {sentence.content}
          </p>
        ))}
      </div>
    </div>
  );
};

export default SongLyrics;
