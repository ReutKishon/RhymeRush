import React, { memo, useEffect, useRef } from "react";
import useAppStore from "../../store/useStore";
import { TypeAnimation } from "react-type-animation";

const SongLyrics = memo(() => {
  const lyrics = useAppStore((state) => state.game.lyrics);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lyrics]);

  return (
    <div className="flex p-10 flex-col w-[80%] h-full overflow-hidden items-center">
      <div ref={scrollRef} className="overflow-y-auto scrollbar-hide ">
        {lyrics.map((sentence, index) => {
          return (
            <div className="flex items-center space-x-4 pb-4">
              <div className="text-xl">{sentence.player.name + ":"}</div>
              <div className="flex-1">
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
