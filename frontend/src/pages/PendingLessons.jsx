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
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PersonIcon from "@mui/icons-material/Person";

import { useContent } from "../hooks/useContent";

const PendingLessons = () => {
  const { getPendingLessons, approveLesson, loading, error } = useContent();
  const [pending, setPending] = useState([]);

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

  const handleApprove = async (id) => {
    try {
      await approveLesson(id);
      setPending((prev) => prev.filter((lesson) => lesson.lessonId !== id));
    } catch (err) {
      alert("Failed to approve lesson: " + err);
    }
  };

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
                onClick={() => handleApprove(lesson.lessonId)}
              >
                Approve
              </Button>
              {/* Optional: Add Reject Button here */}
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default PendingLessons;
