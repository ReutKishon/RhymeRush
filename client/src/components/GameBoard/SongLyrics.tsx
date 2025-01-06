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
        {lyrics.map((_, index) => {
          // Only process pairs (odd and even indices together)
          if (index % 2 === 1) return null;

          const firstSentence = lyrics[index];
          const secondSentence = lyrics[index + 1];

          const markLastWord = (content:string, shouldMark:boolean) => {
            if (!shouldMark) return content;

            const words = content.split(" ");
            words[words.length - 1] = `<span class="text-red-500">${
              words[words.length - 1]
            }</span>`;
            return words.join(" ");
          };

          const firstSentenceRhymeScore =
            secondSentence?.scores?.rhymeScore ?? 0;
          const doesRhyme = firstSentenceRhymeScore > 8; 

          return (
            <React.Fragment key={index}>
              <p className="text-sm md:text-xl mb-2">
                <span
                  style={{
                    color: firstSentence.player.color,
                    marginRight: "8px",
                  }}
                >
                  {firstSentence.player.name}:
                </span>
                <span
                  className="text-black"
                  dangerouslySetInnerHTML={{
                    __html: markLastWord(firstSentence.content, doesRhyme),
                  }}
                />
              </p>
              {secondSentence && (
                <p className="text-sm md:text-xl mb-2">
                  <span
                    style={{
                      color: secondSentence.player.color,
                      marginRight: "8px",
                    }}
                  >
                    {secondSentence.player.name}:
                  </span>
                  <span
                    className="text-black"
                    dangerouslySetInnerHTML={{
                      __html: markLastWord(secondSentence.content, doesRhyme),
                    }}
                  />
                </p>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
});

export default SongLyrics;
