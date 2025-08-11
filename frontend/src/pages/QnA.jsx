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
  Paper,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import EditNoteIcon from "@mui/icons-material/EditNote";
import HelpCenterOutlinedIcon from "@mui/icons-material/HelpCenterOutlined";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import { motion } from "framer-motion";

const QnAPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
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
        setError("Failed to load questions. Please try again later.");
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
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress
          size={64}
          thickness={4}
          sx={{
            color: theme.palette.primary.main,
            "& .MuiCircularProgress-circle": {
              strokeLinecap: "round",
            },
          }}
        />
      </Box>
    );

  if (error)
    return (
      <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
        <Alert
          severity="error"
          sx={{
            borderRadius: 2,
            boxShadow: theme.shadows[1],
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          {error}
        </Alert>
      </Box>
    );

  return (
    <Box
      sx={{
        maxWidth: 1400,
        mx: "auto",
        p: { xs: 2, md: 4 },
        minHeight: "80vh",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <Typography
        variant="h3"
        sx={{
          mb: 4,
          fontWeight: 700,
          color: theme.palette.primary.dark,
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <QuestionAnswerIcon fontSize="large" />
        Community Q&A
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
        }}
      >
        {/* Left side - Ask Question */}
        <Paper
          elevation={3}
          sx={{
            flex: 1,
            p: 4,
            borderRadius: 4,
            bgcolor: "background.paper",
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: theme.shadows[4],
            transition: "transform 0.3s ease",
            "&:hover": {
              transform: "translateY(-5px)",
              boxShadow: theme.shadows[8],
            },
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2} mb={3}>
            <EditNoteIcon
              sx={{
                color: theme.palette.secondary.main,
                fontSize: 32,
              }}
            />
            <Typography
              variant="h5"
              fontWeight={600}
              color="text.primary"
              sx={{
                position: "relative",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: -8,
                  left: 0,
                  width: "60px",
                  height: "4px",
                  background: theme.palette.secondary.main,
                  borderRadius: 2,
                },
              }}
            >
              Ask a Question
            </Typography>
          </Stack>
          <QuestionForm onQuestionCreated={handleQuestionCreated} />
        </Paper>

        {/* Right side - Questions List */}
        <Box
          sx={{
            flex: 2,
            pl: { xs: 0, md: 2 },
            overflowY: "auto",
            maxHeight: { md: "80vh" },
            pr: { md: 2 },
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              borderRadius: 4,
              bgcolor: "background.paper",
              border: `1px solid ${theme.palette.divider}`,
              mb: 4,
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2} mb={3}>
              <HelpOutlineIcon
                sx={{
                  color: theme.palette.primary.main,
                  fontSize: 32,
                }}
              />
              <Typography
                variant="h5"
                fontWeight={600}
                color="text.primary"
                sx={{
                  position: "relative",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    bottom: -8,
                    left: 0,
                    width: "60px",
                    height: "4px",
                    background: theme.palette.primary.main,
                    borderRadius: 2,
                  },
                }}
              >
                Community Questions
              </Typography>
            </Stack>

            {questions.length === 0 ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  py: 8,
                  textAlign: "center",
                }}
              >
                <HelpCenterOutlinedIcon
                  sx={{
                    fontSize: 64,
                    color: "text.disabled",
                    mb: 2,
                    opacity: 0.5,
                  }}
                />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No questions yet
                </Typography>
                <Typography color="text.secondary">
                  Be the first to ask a question and start the discussion!
                </Typography>
              </Box>
            ) : (
              <Stack spacing={3}>
                {questions.map((q, index) => (
                  <motion.div
                    key={q.questionId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Paper
                      elevation={2}
                      sx={{
                        borderRadius: 3,
                        overflow: "hidden",
                        transition: "all 0.3s ease",
                        position: "relative",
                        "&:hover": {
                          transform: "translateY(-3px)",
                          boxShadow: theme.shadows[6],
                        },
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          top: 0,
                          left: 0,
                          height: "100%",
                          width: "4px",
                          background: theme.palette.primary.main,
                        },
                      }}
                    >
                      <Box sx={{ pl: 3, pr: 2, py: 2 }}>
                        <QuestionCard question={q} />
                      </Box>
                    </Paper>
                  </motion.div>
                ))}
              </Stack>
            )}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default QnAPage;