import React from "react";
import useAppStore from "../../store/useStore";
import { Typography } from "@mui/material";

const Topic = ({ topic }: { topic: string }) => {

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
      {topic}
    </Typography>
  );
};

export default Topic;
