import React, { memo, useEffect, useState } from "react";
import useAppStore from "../../store/useStore";
import { socket } from "../../services";
import { LuSendHorizontal } from "react-icons/lu";
import { Input } from "pixel-retroui";

const SentenceInput = memo(() => {
  const [sentence, setSentence] = useState<string>("");
  const [isUserTurn, setIsUserTurn] = useState<boolean>();
  const [error, setError] = useState<string>("");
  const {
    game: { isActive: gameIsActive, currentPlayerName },
    user: { username },
  } = useAppStore((state) => state);

  useEffect(() => {
    setIsUserTurn(gameIsActive && currentPlayerName === username);
  }, [gameIsActive, currentPlayerName]);

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
      {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
    </div>
  );
});

export default SentenceInput;
