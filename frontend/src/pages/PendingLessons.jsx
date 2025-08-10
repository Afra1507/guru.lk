import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Grid,
  CircularProgress,
  Alert,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PersonIcon from "@mui/icons-material/Person";

import { useContent } from "../hooks/useContent";

// Dummy translate function example, replace with your actual one
const translate = (key, language) => {
  const translations = {
    confirmApprovalMessage: "Are you sure you want to approve '$title'?",
    thisLesson: "this lesson",
    cancel: "Cancel",
    approve: "Approve",
  };
  return translations[key] || key;
};

const PendingLessons = () => {
  const { getPendingLessons, approveLesson, loading, error } = useContent();
  const [pending, setPending] = useState([]);
  const [lessonToApprove, setLessonToApprove] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const language = "en"; // Or get from context, user prefs, etc.

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const lessons = await getPendingLessons();
        setPending(lessons);
      } catch (e) {
        console.error("Failed to fetch pending lessons", e);
      }
    };

    fetchPending();
  }, [getPendingLessons]);

  const handleApproveClick = (lesson) => {
    setLessonToApprove(lesson);
    setConfirmOpen(true);
  };

  const handleConfirmClose = () => {
    setConfirmOpen(false);
    setLessonToApprove(null);
  };

  const handleConfirmApprove = async () => {
    if (!lessonToApprove) return;

    try {
      await approveLesson(lessonToApprove.lessonId);
      setPending((prev) =>
        prev.filter((lesson) => lesson.lessonId !== lessonToApprove.lessonId)
      );
      setConfirmOpen(false);
      setLessonToApprove(null);
    } catch (err) {
      alert("Failed to approve lesson: " + err);
      setConfirmOpen(false);
      setLessonToApprove(null);
    }
  };

  const confirmMessage = lessonToApprove
    ? translate("confirmApprovalMessage", language).replace(
        "$title",
        lessonToApprove.title || translate("thisLesson", language)
      )
    : "";

  if (loading)
    return (
      <Stack alignItems="center" mt={4}>
        <CircularProgress />
      </Stack>
    );

  if (error)
    return (
      <Alert severity="error" sx={{ mt: 4 }}>
        {error}
      </Alert>
    );

  if (pending.length === 0)
    return (
      <Typography variant="h6" align="center" mt={4}>
        No pending lessons found.
      </Typography>
    );

  return (
    <>
      <Grid container spacing={3} mt={2}>
        {pending.map((lesson) => (
          <Grid item xs={12} sm={6} md={4} key={lesson.lessonId}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: 3,
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "scale(1.03)",
                  boxShadow: 6,
                },
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom noWrap>
                  {lesson.title}
                </Typography>
                <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                  <PersonIcon color="action" fontSize="small" />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    noWrap
                  >{`Uploaded by User ID: ${lesson.uploaderId}`}</Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary" noWrap>
                  {lesson.description?.length > 100
                    ? lesson.description.slice(0, 100) + "..."
                    : lesson.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: "flex-end", pb: 2, pr: 2 }}>
                <Button
                  variant="contained"
                  color="success"
                  size="small"
                  startIcon={<CheckCircleOutlineIcon />}
                  onClick={() => handleApproveClick(lesson)}
                >
                  Approve
                </Button>
                {/* Optional: Add Reject Button here */}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmOpen}
        onClose={handleConfirmClose}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirm Approval</DialogTitle>
        <DialogContent>
          <DialogContentText>{confirmMessage}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmClose} color="inherit">
            {translate("cancel", language)}
          </Button>
          <Button onClick={handleConfirmApprove} variant="contained" color="success">
            {translate("approve", language)}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PendingLessons;
