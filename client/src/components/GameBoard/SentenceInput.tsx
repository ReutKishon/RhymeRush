import React, { useState } from "react";
import useAppStore from "../../store/useStore.ts";
import { api } from "../../services";
import SendIcon from "@mui/icons-material/Send";
import Button from "@mui/material/Button";
import { Box, TextField } from "@mui/material";

const SentenceInput = () => {
  const [sentence, setSentence] = useState<string>("");
  const [error, setError] = useState<string>("");
  const { user, game } = useAppStore((state) => state);

  const isUserTurn =
    game.isActive && game.turnOrder[game.currentTurnIndex] === user.id;

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

    const submit = async () => {
      try {
        await api.submitSentence(game.code, user.id, sentence);
      } catch (err) {
        setError(err);
      }
    };
    submit();
    setSentence("");
    setError("");
  };

  return (
    <Box
      sx={{
        display: "flex",
        width: "50%",
        justifyContent: "center",
      }}
    >
      <TextField
        variant="outlined"
        placeholder="Type a new line"
        onChange={handleSentenceChange}
        sx={{
          width: "100%",
          height: "50px",
          "& .MuiOutlinedInput-root": {
            height: "50px",
            fontSize: "18px",
            borderRadius: 5,
            borderStyle: "solid",
            borderWidth: 1,
            borderColor: "black",
          },
        }}
      />
      <Button
        onClick={handleSentenceSubmit}
        sx={{
          borderRadius: "100%",
          width: "50px",
          height: "50px",
          minWidth: 0,
          marginLeft: "8px",
          padding: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#ffcccc",
        }}
        variant="contained"
      >
        <SendIcon />
      </Button>
    </Box>
  );
};

export default SentenceInput;
