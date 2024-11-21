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
    <div>
      <h1>Song Lyrics</h1>
      <div>
        {lyrics.map((sentence, index) => (
          <p key={index}>
            {sentence.player.id}: {sentence.content}
          </p>
        ))}
      </div>
    </div>
  );
};

export default SongLyrics;
