// src/components/AnswerForm.jsx
import React, { useState } from "react";
import {
  TextField,
  Button,
  Snackbar,
  Alert,
  Box,
  Typography,
  Stack,
} from "@mui/material";
import * as communityService from "../../services/communityService";
import { getUserIdFromToken } from "../../utils/authUtils";

import SendIcon from "@mui/icons-material/Send";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

const iconMapping = {
  success: <CheckCircleOutlineIcon fontSize="small" />,
  error: <ErrorOutlineIcon fontSize="small" />,
  warning: <WarningAmberIcon fontSize="small" />,
  info: <SendIcon fontSize="small" />,
};

const AnswerForm = ({ questionId, addAnswer }) => {
  const [body, setBody] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const userId = getUserIdFromToken();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      setSnackbar({
        open: true,
        message: "You must be logged in to answer.",
        severity: "warning",
      });
      return;
    }
    if (body.trim().length === 0) {
      setSnackbar({
        open: true,
        message: "Answer cannot be empty.",
        severity: "warning",
      });
      return;
    }

    try {
      const answerData = { questionId, body };
      const res = await communityService.createAnswer(userId, answerData);
      addAnswer(res.data);
      setBody("");
      setSnackbar({
        open: true,
        message: "Answer posted successfully.",
        severity: "success",
      });
    } catch {
      setSnackbar({
        open: true,
        message: "Failed to post answer. Try again.",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      mt={4}
      sx={{
        p: 3,
        backgroundColor: "#f5f5f5",
        borderRadius: 2,
        boxShadow: 1,
      }}
    >
      <Typography
        variant="h6"
        gutterBottom
        sx={{ fontWeight: "medium", color: "text.primary" }}
      >
        Your Answer
      </Typography>
      <TextField
        label="Write your answer here"
        multiline
        rows={5}
        fullWidth
        required
        value={body}
        onChange={(e) => setBody(e.target.value)}
        margin="normal"
        variant="outlined"
        sx={{
          backgroundColor: "white",
          borderRadius: 1,
        }}
      />

      <Stack direction="row" justifyContent="flex-end" mt={2}>
        <Button
          variant="contained"
          color="success"
          type="submit"
          startIcon={<SendIcon />}
          size="large"
          sx={{
            textTransform: "none",
            fontWeight: "bold",
            boxShadow: "0px 4px 10px rgba(76, 175, 80, 0.4)",
            "&:hover": {
              boxShadow: "0px 6px 14px rgba(56, 142, 60, 0.6)",
            },
          }}
        >
          Submit Answer
        </Button>
      </Stack>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          icon={iconMapping[snackbar.severity]}
          sx={{ width: "100%", fontWeight: "medium" }}
          elevation={6}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AnswerForm;
