import { memo, useEffect, useRef } from "react";
import { TypeAnimation } from "react-type-animation";
import { Sentence } from "../../../../shared/types/gameTypes";


function ScrollableDiv({ children }: { children: React.ReactNode }) {
  const scrollableContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollableContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [children]); // Scrolls to the bottom whenever children change

  return (
    <div
      ref={scrollableContainerRef}
      className="w-full h-full overflow-y-auto scrollbar-hide flex flex-col"
    >
      {children}
    </div>
  );
}

const SongLyrics = memo(({ lyrics }: { lyrics: Sentence[] }) => {

  return (
    <ScrollableDiv>
        {lyrics.map((sentence, index) => {
          return (
            <div className="flex items-center space-x-4 pb-4" key={index}>
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
    </ScrollableDiv>
  );
});

export default SongLyrics;
