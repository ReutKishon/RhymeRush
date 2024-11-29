import React, { useEffect, useState } from "react";
import { Game, Sentence } from "../../../../shared/types/gameTypes";
import socket from "../../services/socket.ts";
import { useQueryClient } from "react-query";
import { useGameData } from "../../services/queries.ts";

const SongLyrics: React.FC<{ lyrics: Sentence[] | undefined }> = ({
  lyrics,
}) => {
  if (lyrics === undefined) return null;
  console.log("lyrics: ", lyrics);
  return (
    <div className="h-96 w-100 max-w-4xl overflow-y-auto scrollbar-hidden space-y-6 px-4">
      {lyrics?.map((sentence, index) => (
        <p className="text-black font-bold text-xl" key={index}>
          {sentence.player?.username}: {sentence.content}
        </p>
      ))}
    </div>
  );
};

export default SongLyrics;
