import React, { useEffect, useState } from "react";
import * as communityService from "../services/communityService";
import QuestionCard from "../components/forum/QuestionCard";
import QuestionForm from "../components/forum/QuestionForm";

import {
  Box,
  CircularProgress,
  Alert,
  Typography,
  Stack,
} from "@mui/material";

import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import EditNoteIcon from "@mui/icons-material/EditNote";
import HelpCenterOutlinedIcon from "@mui/icons-material/HelpCenterOutlined";

const QnAPage = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const res = await communityService.getAllQuestions();
        setQuestions(res.data);
      } catch (err) {
        setError("Failed to load questions.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleQuestionCreated = (newQuestion) => {
    setQuestions((prev) => [newQuestion, ...prev]);
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
        <CircularProgress color="primary" size={64} />
      </Box>
    );

  if (error)
    return (
      <Box sx={{ width: "100%", mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );

  return (
    <Box
      sx={{
        maxWidth: 1200,
        mx: "auto",
        p: 3,
        minHeight: "80vh",
        display: "flex",
        flexDirection: "row",
        gap: 3,
      }}
    >
      {/* Left side - Ask Question */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          borderRight: { xs: "none", md: "1px solid #ccc" },
          pr: { xs: 0, md: 3 },
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1} mb={2}>
          <EditNoteIcon color="secondary" />
          <Typography variant="h6" fontWeight={600}>
            Ask a Question
          </Typography>
        </Stack>
        <QuestionForm onQuestionCreated={handleQuestionCreated} />
      </Box>

      {/* Right side - Questions List */}
      <Box
        sx={{
          flex: 1,
          pl: { xs: 0, md: 3 },
          overflowY: "auto",
          maxHeight: "80vh",
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1} mb={2}>
          <HelpOutlineIcon color="primary" fontSize="medium" />
          <Typography variant="h6" fontWeight={600}>
            Questions
          </Typography>
        </Stack>

        {questions.length === 0 ? (
          <Typography
            variant="body1"
            color="text.secondary"
            align="center"
            sx={{ mt: 4 }}
          >
            No questions yet. Be the first to ask!
          </Typography>
        ) : (
          <Stack spacing={3}>
            {questions.map((q) => (
              <Box
                key={q.questionId}
                sx={{
                  position: "relative",
                  borderRadius: 2,
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  cursor: "pointer",
                  pl: 5, // add left padding to make space for the icon
                  "&:hover": {
                    transform: "scale(1.03)",
                    boxShadow: "0 10px 20px rgba(0,0,0,0.12)",
                  },
                }}
              >
                <HelpCenterOutlinedIcon
                  color="action"
                  sx={{
                    position: "absolute",
                    left: 8, // inside padding now
                    top: 12,
                    fontSize: 28,
                    opacity: 0.25,
                    pointerEvents: "none",
                  }}
                />
                <QuestionCard question={q} />
              </Box>
            ))}
          </Stack>
        )}
      </Box>
    </Box>
  );
};

export default QnAPage;
