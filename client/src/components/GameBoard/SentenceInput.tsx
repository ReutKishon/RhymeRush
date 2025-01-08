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
    console.log("handleSentenceSubmit - Turn Status:", isUserTurn);
    if (!isUserTurn) {
      setError("It's not your turn!");
      return;
    }

    const trimmedSentence = sentence.trim();
    if (trimmedSentence === "") {
      setError("Sentence cannot be empty.");
      return;
    }

    try {
      console.log("Emitting sentence:", trimmedSentence);
      socket.emit("addSentence", trimmedSentence);
      setSentence("");
      setError("");
    } catch (err) {
      console.error("Error sending sentence:", err);
      setError("Failed to send sentence. Please try again.");
    }
  };

  return (
    <div className="flex w-full gap-4 items-center">
      <input
        placeholder="Type a new line"
        onChange={handleSentenceChange}
        disabled={!isUserTurn}
        className="w-full h-[60px] p-4 text-[18px] rounded-full border-2 border-pink-600"
        value={sentence}
      />
      <div className="flex items-center justify-center w-[60px] h-[60px] rounded-full bg-pink-600  p-2">
        <LuSendHorizontal
          className="mt-2"
          onClick={handleSentenceSubmit}
          size={30}
          color="white"
          style={{ width: "100%", height: "100%" }}
        />
      </div>
      {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
    </div>
  );
});

export default SentenceInput;
