import React from "react";
import useAppStore from "../../store/useStore";
import { Typography } from "@mui/material";

const Topic = () => {
  const { game } = useAppStore((state) => state);

  return (
    <Typography
      variant="h2"
      sx={{
        fontWeight: "bold",
        textAlign: "center",
        width: "70%",
        marginX: "auto",
        fontSize: "2rem",
        color: "#ff4d4d",
      }}
    >
      {game.topic}
    </Typography>
  );
};

export default Topic;
