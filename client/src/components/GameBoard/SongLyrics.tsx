import { memo, useEffect, useRef, useState } from "react";
import { TypeAnimation } from "react-type-animation";
import { Sentence } from "../../../../shared/types/gameTypes";
import PlayerAvatarMini from "./PlayerAvatarMini";
import { useTranslations } from "hooks/useTranslations";
import Modal from "../common/Modal";

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
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [modalBgColor, setModalBgColor] = useState("");

  const onScoreClick = (score: number, content: string) => {
    setShowScoreModal(true);
    setModalContent(content);
    setModalBgColor(scoreClass(score));
  };

  const onCloseModal = () => {
    setShowScoreModal(false);
    setModalContent("");
  };

  const scoreClass = (score: number) => {
    return score < 5
      ? "bg-red-500"
      : score > 7
      ? "bg-green-500"
      : "bg-orange-500";
  };

  return (
    <div>
      <ScrollableDiv>
        {lyrics.map((sentence, index) => {
          return (
            <div key={sentence.id} className="flex flex-col space-y-1 pb-4">
              {sentence.score && (
                <div
                  className={`flex w-20 mb-2 justify-center rounded-full ${scoreClass(
                    sentence.score
                  )}`}
                >
                  <p
                    onClick={() =>
                      onScoreClick(sentence.score, sentence.scoreComments)
                    }
                    className="text-md font-bold text-white"
                  >
                    {sentence.score} points
                  </p>
                </div>
              )}

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
      <Modal
        isOpen={showScoreModal}
        onClose={onCloseModal}
        bgColor={modalBgColor}
        variant="secondary"
      >
        <p>{modalContent}</p>
      </Modal>
    </div>
  );
});

export default SongLyrics;
