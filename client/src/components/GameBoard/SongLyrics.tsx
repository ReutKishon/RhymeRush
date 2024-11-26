import React, { useEffect, useState } from "react";
import { Player, Sentence } from "../../../../shared/types/gameTypes";
import socket from "../../services/socket.ts";

interface SongLyricsProps {
  initialLyrics: Sentence[];
}
const SongLyrics: React.FC<SongLyricsProps> = ({ initialLyrics }) => {
  const [lyrics, setLyrics] = useState<Sentence[]>(initialLyrics);

  useEffect(() => {
    socket.on("updatedLyrics", (updatedLyrics: Sentence[]) => {
      setLyrics(updatedLyrics);
    });

    return () => {
      socket.off("newSentence");
    };
  }, []);

  return (
    <div className="h-96 w-100 max-w-4xl overflow-y-auto scrollbar-hidden space-y-6 px-4">
      {lyrics.map((sentence, index) => (
        <p className="text-black font-bold text-xl" key={index}>
          {sentence.player.username}: {sentence.content}
        </p>
      ))}
    </div>
  );
};

export default SongLyrics;
