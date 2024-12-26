import React, { useState } from "react";
import useAppStore from "../../store/useStore.ts";
import { api, socket } from "../../services";
import { LuSendHorizontal } from "react-icons/lu";
import Button from "@mui/material/Button";
import { Box, TextField } from "@mui/material";
import { Input } from "pixel-retroui";

const SentenceInput = () => {
  const [sentence, setSentence] = useState<string>("");
  const [error, setError] = useState<string>("");
  const { game,userName } = useAppStore((state) => state);

  const isUserTurn = game.isActive && game.currentPlayerName === userName;

  const handleSentenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSentence(e.target.value);
  };

  const handleSentenceSubmit = () => {
    if (!isUserTurn) {
      return;
    }

    if (sentence.trim() === "") {
      setError("Sentence cannot be empty.");
      return;
    }
    socket.emit("addSentence", sentence);

    setSentence("");
    setError("");
  };

  return (
    <div className="flex w-[95%] sm:w-[50%] gap-4 items-center">
      <Input
        placeholder="Type a new line"
        onChange={handleSentenceChange}
        disabled={!isUserTurn}
        className="w-full h-[50px] text-[18px]"
        value={sentence}
      />

      <LuSendHorizontal
        className="mt-2"
        onClick={handleSentenceSubmit}
        size={50}
      />
    </div>
  );
};

export default SentenceInput;
