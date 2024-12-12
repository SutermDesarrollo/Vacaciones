import { Box, Typography } from "@mui/material";
import React from "react";

function NumberLabel({ number, label }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: "1rem",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          border: "1px solid gray",
          borderRadius: "4px",
          width: "3rem",
          height: "3rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant={"h6"} sx={{ fontWeight: "bold" }}>
          {number}
        </Typography>
      </Box>
      <Typography>{label}</Typography>
    </Box>
  );
}

export default NumberLabel;
