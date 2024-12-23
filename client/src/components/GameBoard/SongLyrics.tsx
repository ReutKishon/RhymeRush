import React from "react";
import useAppStore from "../../store/useStore";
import { Box, Typography } from "@mui/material";

const SongLyrics = () => {
  const { game } = useAppStore((state) => state);

  return (
    <Box
      sx={{
        width: "80%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start", // Align the lyrics to the start (left by default)
          width: "100%", // Make the inner container take full width of the outer container
          maxWidth: "600px", // Optionally set a max width for the inner container
        }}
      >
        {game.lyrics.map((sentence, index) => (
          <Typography
            key={index}
            sx={{
              color: "black",
              fontWeight: "bold",
              fontSize: "1.25rem", // Equivalent to text-xl in Tailwind
              marginBottom: 2, // Adds space between each sentence
            }}
          >
            {game.players.find((p) => p.id === sentence.playerId)?.name}:{" "}
            {sentence.content}
          </Typography>
        ))}
      </Box>
    </Box>
  );
};

export default SongLyrics;
