// src/components/QuestionDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as communityService from "../../services/communityService";
import AnswerCard from "./AnswerCard";
import AnswerForm from "./AnswerForm";
import { getUserIdFromToken } from "../../utils/authUtils";

import {
  Box,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  Divider,
  Stack,
  Paper,
} from "@mui/material";

import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

const QuestionDetail = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showErrorSnackbar, setShowErrorSnackbar] = useState(false);
  const userId = getUserIdFromToken();

  useEffect(() => {
    const fetchQuestionAndAnswers = async () => {
      try {
        setLoading(true);
        const questionRes = await communityService.getQuestion(id);
        const answersRes = await communityService.getAnswersByQuestionId(id);
        setQuestion(questionRes.data);
        setAnswers(answersRes.data);
      } catch (err) {
        setError("Failed to load question or answers.");
        setShowErrorSnackbar(true);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestionAndAnswers();
  }, [id]);

  const addAnswer = (newAnswer) => {
    setAnswers((prev) => [newAnswer, ...prev]);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setShowErrorSnackbar(false);
  };

  if (loading)
    return (
      <Box
        sx={{
          width: "100%",
          height: "60vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress color="primary" size={60} />
      </Box>
    );

  if (!question)
    return (
      <Typography variant="h6" align="center" color="text.secondary" mt={4}>
        No question found
      </Typography>
    );

  return (
    <Box sx={{ maxWidth: 850, mx: "auto", p: 3 }}>
      {/* Question Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 2,
          gap: 1,
          color: "primary.main",
        }}
      >
        <HelpOutlineIcon fontSize="large" />
        <Typography variant="h4" fontWeight="bold" component="h1">
          {question.title}
        </Typography>
      </Box>

      {/* Question Body */}
      <Paper
        elevation={3}
        sx={{ p: 3, mb: 2, backgroundColor: "#f9f9f9", borderRadius: 2 }}
      >
        <Typography variant="body1" mb={1.5} sx={{ whiteSpace: "pre-line" }}>
          {question.body}
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block">
          Asked by: <strong>{question.userId}</strong>
        </Typography>
      </Paper>

      <Divider sx={{ mb: 3 }} />

      {/* Answers Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 2,
          gap: 1,
          color: "secondary.main",
        }}
      >
        <QuestionAnswerIcon fontSize="medium" />
        <Typography variant="h5" fontWeight="medium" component="h2">
          Answers
        </Typography>
      </Box>

      {answers.length === 0 ? (
        <Typography variant="body2" color="text.secondary" mb={4} align="center">
          No answers yet. Be the first to answer!
        </Typography>
      ) : (
        <Stack spacing={3} mb={4}>
          {answers.map((answer) => (
            <AnswerCard key={answer.answerId} answer={answer} />
          ))}
        </Stack>
      )}

      {userId ? (
        <AnswerForm questionId={question.questionId} addAnswer={addAnswer} />
      ) : (
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ mt: 2 }}
        >
          Please log in to post an answer.
        </Typography>
      )}

      {/* Snackbar for errors */}
      <Snackbar
        open={showErrorSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          sx={{ width: "100%", display: "flex", alignItems: "center", gap: 1 }}
          elevation={6}
          variant="filled"
          iconMapping={{
            error: <HelpOutlineIcon fontSize="small" />,
          }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default QuestionDetail;
