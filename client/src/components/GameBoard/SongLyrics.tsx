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
        {game.lyrics.map((sentence, index) => {
          const player = game.players.find((p) => p.id === sentence.playerId);
          const textColor = player?.color;

          return (
            <p key={index} className="text-sm md:text-xl mb-2">
              <span
                style={{
                  color: textColor,
                  marginRight: "8px",
                }}
              >
                {player?.name}:
              </span>
              <span className="text-black">{sentence.content}</span>
            </p>
          );
        })}
      </div>
    </div>
  );
};

export default SongLyrics;
