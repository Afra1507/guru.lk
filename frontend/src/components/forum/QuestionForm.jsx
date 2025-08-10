// src/components/QuestionForm.jsx
import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Snackbar,
  Alert,
  Stack,
  InputLabel,
  FormControl,
  Select,
} from "@mui/material";
import { Send as SendIcon, Language as LanguageIcon } from "@mui/icons-material";
import * as communityService from "../../services/communityService";
import { getUserIdFromToken } from "../../utils/authUtils";

const languages = [
  { value: "sinhala", label: "SINHALA" },
  { value: "tamil", label: "TAMIL" },
  { value: "english", label: "ENGLISH" },
];

const QuestionForm = ({ onQuestionCreated }) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [language, setLanguage] = useState("english");
  const [error, setError] = useState(null);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const userId = getUserIdFromToken();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      setError("You must be logged in to ask a question.");
      setShowSnackbar(true);
      return;
    }
    if (!language) {
      setError("Please select a language.");
      setShowSnackbar(true);
      return;
    }
    try {
      setError(null);
      const questionData = { title, body, language: language.toLowerCase() };
      const res = await communityService.createQuestion(userId, questionData);
      onQuestionCreated(res.data);
      setTitle("");
      setBody("");
      setLanguage("english");
    } catch {
      setError("Failed to create question. Try again.");
      setShowSnackbar(true);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setShowSnackbar(false);
  };

  return (
    <>
      <Box
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
        sx={{ mt: 1 }}
      >
        <Stack spacing={3}>
          <TextField
            label="Title"
            variant="outlined"
            required
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <TextField
            label="Body"
            variant="outlined"
            multiline
            rows={4}
            required
            fullWidth
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />

          <FormControl fullWidth required>
            <InputLabel id="language-label">
              <Stack direction="row" spacing={1} alignItems="center">
                <LanguageIcon fontSize="small" />
                Language
              </Stack>
            </InputLabel>
            <Select
              labelId="language-label"
              value={language}
              label="Language"
              onChange={(e) => setLanguage(e.target.value)}
            >
              {languages.map((lang) => (
                <MenuItem key={lang.value} value={lang.value}>
                  {lang.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            color="primary"
            type="submit"
            endIcon={<SendIcon />}
          >
            Ask Question
          </Button>
        </Stack>
      </Box>

      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          elevation={6}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};

export default QuestionForm;
