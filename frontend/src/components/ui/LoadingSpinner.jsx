import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

const LoadingSpinner = ({ size = "md", message = "Loading..." }) => {
  // Map size prop to MUI CircularProgress size in pixels
  const sizeMap = {
    sm: 24,
    md: 40,
    lg: 60,
  };
  const spinnerSize = sizeMap[size] || sizeMap.md;

  return (
    <Box
      sx={{
        my: 5,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
      }}
    >
      <CircularProgress size={spinnerSize} />
      <Typography variant="body2" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
};

export default LoadingSpinner;
