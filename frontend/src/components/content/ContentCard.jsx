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
import {jwtDecode} from "jwt-decode";
import { translate } from "../../utils/language";

const ContentCard = ({ lesson }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [isDownloading, setIsDownloading] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const currentLanguage = localStorage.getItem("language") || "sinhala";

  const getUserIdFromToken = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return undefined;
      const decoded = jwtDecode(token);
      return decoded?.id || decoded?.userId || decoded?.sub;
    } catch (e) {
      return undefined;
    }
  };

  const handleDownload = async (e) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      setSnackbar({
        open: true,
        message: translate("contentCard.pleaseLoginToDownload", currentLanguage),
        severity: "warning",
      });
      return;
    }

    const userId = getUserIdFromToken();
    const lessonId = lesson.lessonId;

    if (!userId) {
      setSnackbar({
        open: true,
        message: translate("contentCard.userIdNotFound", currentLanguage),
        severity: "error",
      });
      return;
    }

    try {
      setIsDownloading(true);

      const downloadResponse = await contentService.createDownload(
        userId,
        lessonId
      );

      if (!downloadResponse?.fileUrl) {
        setSnackbar({
          open: true,
          message: translate("contentCard.downloadUrlNotFound", currentLanguage),
          severity: "error",
        });
        return;
      }

      setSnackbar({
        open: true,
        message: translate("contentCard.downloadRegistered", currentLanguage),
        severity: "success",
      });

      window.open(downloadResponse.fileUrl, "_blank");
    } catch (err) {
      setSnackbar({
        open: true,
        message:
          err?.message ||
          translate("contentCard.downloadFailed", currentLanguage),
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
            {isDownloading
              ? translate("contentCard.downloadProcessing", currentLanguage)
              : translate("contentCard.download", currentLanguage)}
          </Button>
        </CardActions>
      </Card>

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
