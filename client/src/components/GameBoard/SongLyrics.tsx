import React, { memo, useEffect, useRef } from "react";
import useAppStore from "../../store/useStore";

const SongLyrics = memo(() => {
  const lyrics = useAppStore((state) => state.game.lyrics);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lyrics]);

  return (
    <div className="flex flex-col w-full h-full overflow-hidden justify-center items-center">
      <div
        ref={scrollRef}
        className="overflow-y-auto scrollbar-hide w-full h-full text-center"
      >
        {lyrics.map((sentence, index) => {
          const sentenceAuthor = sentence.player;
          const textColor = sentenceAuthor.color;

          return (
            <p key={index} className="text-sm md:text-xl mb-2">
              <span
                style={{
                  color: textColor,
                  marginRight: "8px",
                }}
              >
                {sentenceAuthor.name}:
              </span>
              <span className="text-black">{sentence.content}</span>
            </p>
          );
        })}
      </div>
    </div>
  );
});

export default SongLyrics;
