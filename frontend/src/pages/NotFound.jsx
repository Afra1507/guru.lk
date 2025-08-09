import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Typography, Button, Stack } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const NotFound = () => {
  return (
    <Box
      sx={{
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        px: 2,
      }}
    >
      <Stack
        spacing={2}
        alignItems="center"
        sx={{
          mb: 3,
          animation: "bounce 1.5s ease-in-out infinite",
          "@keyframes bounce": {
            "0%, 100%": { transform: "translateY(0)" },
            "50%": { transform: "translateY(-15px)" },
          },
        }}
      >
        <ErrorOutlineIcon color="error" sx={{ fontSize: 100 }} />
        <Typography variant="h1" fontWeight="bold" color="error">
          404
        </Typography>
      </Stack>

      <Typography variant="h6" sx={{ mb: 3 }}>
        Oops! The page you’re looking for doesn’t exist.
      </Typography>

      <Button
        component={RouterLink}
        to="/"
        variant="contained"
        color="primary"
        size="large"
      >
        Go Back Home
      </Button>
    </Box>
  );
};

export default NotFound;
