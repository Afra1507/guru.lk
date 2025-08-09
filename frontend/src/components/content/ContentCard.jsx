import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Stack,
  Snackbar,
  Alert,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import SubjectIcon from "@mui/icons-material/Subject";
import LanguageIcon from "@mui/icons-material/Language";
import { useAuth } from "../../auth/useAuth";
import { useNavigate } from "react-router-dom";
import contentService from "../../services/contentService";
import { jwtDecode } from "jwt-decode";

const ContentCard = ({ lesson }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [isDownloading, setIsDownloading] = useState(false);

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // Function to get userId from JWT token
  const getUserIdFromToken = () => {
    try {
      const token = localStorage.getItem("token"); // Adjust key if you store token elsewhere
      if (!token) return undefined;
      const decoded = jwtDecode(token);
      return decoded?.id || decoded?.userId || decoded?.sub; // depends on your token structure
    } catch (e) {
      // silent fail, no console log here
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
    const lessonId = lesson.lessonId;

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

      // Call the createDownload endpoint to register download and get JSON response
      const downloadResponse = await contentService.createDownload(
        userId,
        lessonId
      );

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

      // Open the fileUrl in a new tab
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

  const handleView = () => {
    navigate(`/lessons/${lesson.lessonId}`);
  };

  return (
    <>
      <Card
        onClick={handleView}
        sx={{
          cursor: "pointer",
          maxWidth: 360,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100%",
          "&:hover": {
            boxShadow: 6,
            transform: "scale(1.02)",
            transition: "transform 0.3s ease",
          },
        }}
        elevation={3}
      >
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="h6" component="div" gutterBottom noWrap>
            {lesson.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {lesson.description}
          </Typography>

          <Stack direction="row" spacing={1} mt={2} flexWrap="wrap">
            <Chip
              icon={<SubjectIcon />}
              label={lesson.subject}
              color="info"
              size="small"
            />
            <Chip
              icon={<LanguageIcon />}
              label={lesson.language}
              color="secondary"
              size="small"
            />
          </Stack>
        </CardContent>

        <CardActions sx={{ justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            size="small"
            startIcon={<DownloadIcon />}
            onClick={handleDownload}
            disabled={isDownloading}
            onFocus={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {isDownloading ? "Processing..." : "Download"}
          </Button>
        </CardActions>
      </Card>

      {/* Snackbar for notifications */}
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
    </>
  );
};

export default ContentCard;
