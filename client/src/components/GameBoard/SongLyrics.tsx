import { memo, useEffect, useRef } from "react";
import { TypeAnimation } from "react-type-animation";
import { Sentence } from "../../../../shared/types/gameTypes";
import PlayerAvatarMini from "./PlayerAvatarMini";

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
          <div className="flex flex-col space-y-1 pb-4">
            <p className="text-lg font-bold">{sentence.score}</p>
            <div className="flex space-between gap-3 items-center">
              <PlayerAvatarMini name={sentence.player.name} />
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
