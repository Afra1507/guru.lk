import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  Button,
  CircularProgress,
  Alert,
  Snackbar,
  Box,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { useContent } from "../hooks/useContent";
import { useAuth } from "../auth/useAuth";
import {jwtDecode} from "jwt-decode";

const LessonViewer = () => {
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);
  const { getLessonById, incrementViewCount, loading, error } = useContent();
  const { isAuthenticated } = useAuth();

  const [isDownloading, setIsDownloading] = useState(false);

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  useEffect(() => {
    const loadLesson = async () => {
      try {
        const data = await getLessonById(id);
        setLesson(data);
        await incrementViewCount(id);
      } catch (err) {
        console.error(err);
      }
    };
    loadLesson();
  }, [id, getLessonById, incrementViewCount]);

  // Extract userId from token (same as ContentCard)
  const getUserIdFromToken = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return undefined;
      const decoded = jwtDecode(token);
      return decoded?.id || decoded?.userId || decoded?.sub;
    } catch {
      return undefined;
    }
  };

  const handleDownload = async (e) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      setSnackbar({
        open: true,
        message: "Please login to download.",
        severity: "warning",
      });
      return;
    }

    const userId = getUserIdFromToken();
    if (!userId) {
      setSnackbar({
        open: true,
        message: "Could not determine user ID. Please login again.",
        severity: "error",
      });
      return;
    }

    try {
      setIsDownloading(true);

      // Here call your contentService.createDownload(userId, lessonId)
      // Assuming useContent hook exposes createDownload function or import contentService here directly
      // I'll import contentService directly here for clarity
      const contentService = (await import("../services/contentService")).default;

      const downloadResponse = await contentService.createDownload(userId, id);

      if (!downloadResponse?.fileUrl) {
        setSnackbar({
          open: true,
          message: "Download URL not found in the response.",
          severity: "error",
        });
        return;
      }

      setSnackbar({
        open: true,
        message: "Download registered! Starting download...",
        severity: "success",
      });

      window.open(downloadResponse.fileUrl, "_blank");
    } catch (err) {
      setSnackbar({
        open: true,
        message: err?.message || "Download failed. Please try again.",
        severity: "error",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 10 }}>
        <CircularProgress />
      </Box>
    );
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!lesson) return null;

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Card
        sx={{
          boxShadow: 4,
          borderRadius: 3,
          backgroundColor: "#f9fafb",
          p: 3,
        }}
      >
        <CardContent>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              fontFamily: "'Roboto Slab', serif",
              fontWeight: "700",
              color: "#2c3e50",
            }}
          >
            {lesson.title}
          </Typography>

          <Stack direction="row" spacing={2} mb={3}>
            <Chip label={lesson.subject} color="primary" />
            <Chip label={lesson.language} color="secondary" />
            <Chip
              label={lesson.ageGroup}
              sx={{ bgcolor: "#ffca28", color: "#000" }}
            />
          </Stack>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 4, fontSize: "1.1rem", lineHeight: 1.6 }}
          >
            {lesson.description}
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems="center"
            spacing={1}
          >
            <Stack
              direction="row"
              spacing={3}
              alignItems="center"
              color="text.secondary"
            >
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <VisibilityIcon fontSize="small" />
                <Typography variant="subtitle2">
                  Views: {lesson.viewCount}
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <CalendarTodayIcon fontSize="small" />
                <Typography variant="subtitle2">
                  Uploaded: {new Date(lesson.createdAt).toLocaleDateString()}
                </Typography>
              </Stack>
            </Stack>

            <Button
              variant="contained"
              color="success"
              startIcon={<DownloadIcon />}
              onClick={handleDownload}
              disabled={isDownloading}
              onFocus={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              sx={{
                textTransform: "none",
                fontWeight: "600",
                px: 3,
                py: 1.2,
                boxShadow: "0 4px 12px rgb(0 128 0 / 0.3)",
                "&:hover": {
                  backgroundColor: "#2e7d32",
                  boxShadow: "0 6px 18px rgb(0 128 0 / 0.5)",
                },
              }}
            >
              {isDownloading ? "Processing..." : "Download"}
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default LessonViewer;
