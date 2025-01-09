import { memo, useEffect, useRef } from "react";
import { TypeAnimation } from "react-type-animation";
import { Sentence } from "../../../../shared/types/gameTypes";

const SongLyrics = memo(({ lyrics }: { lyrics: Sentence[] }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lyrics]);

  return (
    <div className="flex flex-col h-full items-center">
      <div ref={scrollRef} className="overflow-y-auto scrollbar-hide ">
        {lyrics.map((sentence, index) => {
          return (
            <div className="flex items-center space-x-4 pb-4">
              <div className="text-xl">{sentence.player.name + ":"}</div>
              <div className="flex">
                {index === lyrics.length - 1 ? (
                  <TypeAnimation
                    sequence={[sentence.content, 1000]}
                    speed={50}
                    cursor={true}
                    className="text-xl"
                    style={{ direction: "ltr" }}
                    repeat={Infinity}
                  />
                ) : (
                  <div className="text-xl">{sentence.content}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default SongLyrics;
