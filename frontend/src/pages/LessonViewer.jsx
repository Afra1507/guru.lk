import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Card,
  Typography,
  Chip,
  Stack,
  Button,
  CircularProgress,
  Alert,
  Snackbar,
  Box,
  CssBaseline,
  createTheme,
  ThemeProvider,
  Divider,
} from "@mui/material";

import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

import ComputerIcon from "@mui/icons-material/Computer";
import CalculateIcon from "@mui/icons-material/Calculate";
import ScienceIcon from "@mui/icons-material/Science";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import BookIcon from "@mui/icons-material/Book";
import LanguageIcon from "@mui/icons-material/Language";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import PaletteIcon from "@mui/icons-material/Palette";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import PsychologyIcon from "@mui/icons-material/Psychology";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import ArchitectureIcon from "@mui/icons-material/Architecture";
import SecurityIcon from "@mui/icons-material/Security";
import StorageIcon from "@mui/icons-material/Storage";
import WebIcon from "@mui/icons-material/Web";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import DataUsageIcon from "@mui/icons-material/DataUsage";
import ScienceOutlinedIcon from "@mui/icons-material/ScienceOutlined";
import GavelIcon from "@mui/icons-material/Gavel";
import EcoIcon from "@mui/icons-material/Grass";
import MarketingIcon from "@mui/icons-material/TrendingUp";
import SchoolIcon from "@mui/icons-material/School";

import { useContent } from "../hooks/useContent";
import { useAuth } from "../auth/useAuth";
import {jwtDecode} from "jwt-decode";

// MUI theme
const theme = createTheme({
  typography: {
    fontFamily: `'Roboto', 'Helvetica', 'Arial', sans-serif`,
  },
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#9c27b0" },
    success: { main: "#388e3c" },
    warning: { main: "#ffa000" },
    error: { main: "#d32f2f" },
  },
});

// Map all subjects to icons
const iconSize = 70; // 56px or adjust as you like

const subjectIcons = {
  // Grades 1-9 & O-Level common subjects
  Mathematics: <CalculateIcon sx={{ fontSize: iconSize }} color="primary" />,
  Science: <ScienceIcon sx={{ fontSize: iconSize }} color="primary" />,
  Sinhala: <LanguageIcon sx={{ fontSize: iconSize }} color="primary" />,
  Tamil: <LanguageIcon sx={{ fontSize: iconSize }} color="primary" />,
  English: <LanguageIcon sx={{ fontSize: iconSize }} color="primary" />,
  History: <HistoryEduIcon sx={{ fontSize: iconSize }} color="primary" />,
  Geography: <SchoolIcon sx={{ fontSize: iconSize }} color="primary" />,
  Civics: <AccountBalanceIcon sx={{ fontSize: iconSize }} color="primary" />,
  Religion: <SchoolIcon sx={{ fontSize: iconSize }} color="primary" />,
  "Health & Physical Education": <SportsSoccerIcon sx={{ fontSize: iconSize }} color="primary" />,
  Art: <PaletteIcon sx={{ fontSize: iconSize }} color="primary" />,
  Music: <MusicNoteIcon sx={{ fontSize: iconSize }} color="primary" />,
  "Information & Communication Technology": <ComputerIcon sx={{ fontSize: iconSize }} color="primary" />,
  Commerce: <BusinessCenterIcon sx={{ fontSize: iconSize }} color="primary" />,
  Literature: <BookIcon sx={{ fontSize: iconSize }} color="primary" />,

  // O-Level & A-Level specific
  "Combined Mathematics": <CalculateIcon sx={{ fontSize: iconSize }} color="primary" />,
  Physics: <ScienceOutlinedIcon sx={{ fontSize: iconSize }} color="primary" />,
  Chemistry: <ScienceOutlinedIcon sx={{ fontSize: iconSize }} color="primary" />,
  Biology: <EcoIcon sx={{ fontSize: iconSize }} color="primary" />,
  Accounting: <AccountBalanceIcon sx={{ fontSize: iconSize }} color="primary" />,
  "Business Studies": <BusinessCenterIcon sx={{ fontSize: iconSize }} color="primary" />,
  Economics: <MarketingIcon sx={{ fontSize: iconSize }} color="primary" />,
  Agriculture: <EcoIcon sx={{ fontSize: iconSize }} color="primary" />,
  "Engineering Technology": <CalculateIcon sx={{ fontSize: iconSize }} color="primary" />,
  "Political Science": <GavelIcon sx={{ fontSize: iconSize }} color="primary" />,
  Logic: <CalculateIcon sx={{ fontSize: iconSize }} color="primary" />,

  // Campus Major Subjects
  "Computer Science": <ComputerIcon sx={{ fontSize: iconSize }} color="primary" />,
  Law: <GavelIcon sx={{ fontSize: iconSize }} color="primary" />,
  Medicine: <LocalHospitalIcon sx={{ fontSize: iconSize }} color="primary" />,
  Engineering: <CalculateIcon sx={{ fontSize: iconSize }} color="primary" />,
  Nursing: <LocalHospitalIcon sx={{ fontSize: iconSize }} color="primary" />,
  Architecture: <ArchitectureIcon sx={{ fontSize: iconSize }} color="primary" />,
  Management: <BusinessCenterIcon sx={{ fontSize: iconSize }} color="primary" />,
  Psychology: <PsychologyIcon sx={{ fontSize: iconSize }} color="primary" />,
  "Environmental Science": <EcoIcon sx={{ fontSize: iconSize }} color="primary" />,
  Finance: <AccountBalanceIcon sx={{ fontSize: iconSize }} color="primary" />,
  Marketing: <MarketingIcon sx={{ fontSize: iconSize }} color="primary" />,
  Statistics: <DataUsageIcon sx={{ fontSize: iconSize }} color="primary" />,
  "Information Technology": <StorageIcon sx={{ fontSize: iconSize }} color="primary" />,
  Business: <BusinessCenterIcon sx={{ fontSize: iconSize }} color="primary" />,
  "Data science": <DataUsageIcon sx={{ fontSize: iconSize }} color="primary" />,
  "Artificial Intelligence": <ComputerIcon sx={{ fontSize: iconSize }} color="primary" />,
  "Cyber Security": <SecurityIcon sx={{ fontSize: iconSize }} color="primary" />,
  "Software Engineering": <ComputerIcon sx={{ fontSize: iconSize }} color="primary" />,
  "Web Development": <WebIcon sx={{ fontSize: iconSize }} color="primary" />,
  "Mobile App Development": <PhoneAndroidIcon sx={{ fontSize: iconSize }} color="primary" />,
  "Applied Mathematics": <CalculateIcon sx={{ fontSize: iconSize }} color="primary" />,
  "Bio Science": <EcoIcon sx={{ fontSize: iconSize }} color="primary" />,

  // Fallback
  Other: <BookIcon sx={{ fontSize: iconSize }} color="primary" />,
};


const LessonViewer = () => {
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);
  const { getLessonById, incrementViewCount, loading, error } = useContent();
  const { isAuthenticated } = useAuth();

  const [isDownloading, setIsDownloading] = useState(false);

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

  // Extract userId from token
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

      const contentService = (await import("../services/contentService"))
        .default;
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
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 10 }}>
          <CircularProgress />
        </Box>
      </ThemeProvider>
    );
  if (error)
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Alert severity="error" sx={{ mt: 4, mx: "auto", maxWidth: 600 }}>
          {error}
        </Alert>
      </ThemeProvider>
    );
  if (!lesson) return null;

  const SubjectIcon = subjectIcons[lesson.subject] || (
    <BookIcon fontSize="large" color="primary" />
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ mt: 6, mb: 6 }}>
        <Card
          sx={{
            boxShadow: 6,
            borderRadius: 4,
            backgroundColor: "#fefefe",
            p: { xs: 3, md: 5 },
            transition: "box-shadow 0.3s ease-in-out",
            "&:hover": {
              boxShadow: 12,
            },
            position: "relative",
          }}
        >
          {/* Title + Icon */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 3,
            }}
          >
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 700,
                color: "#2c3e50",
                letterSpacing: 0.7,
                flex: 1,
                mr: 2,
              }}
            >
              {lesson.title}
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "primary.main",
              }}
              aria-label={`Subject Icon for ${lesson.subject}`}
            >
              {SubjectIcon}
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Stack direction="row" spacing={2} mb={4}>
            <Chip
              label={lesson.subject}
              color="primary"
              sx={{ fontWeight: 600, fontSize: "0.9rem" }}
            />
            <Chip
              label={lesson.language}
              color="secondary"
              sx={{ fontWeight: 600, fontSize: "0.9rem" }}
            />
            <Chip
              label={lesson.ageGroup}
              sx={{
                bgcolor: "#ffca28",
                color: "#000",
                fontWeight: 600,
                fontSize: "0.9rem",
              }}
            />
          </Stack>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 5, fontSize: "1.15rem", lineHeight: 1.7 }}
          >
            {lesson.description}
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
            <Stack
              direction="row"
              spacing={4}
              alignItems="center"
              color="text.secondary"
              sx={{ fontSize: "0.9rem" }}
            >
              <Stack direction="row" alignItems="center" spacing={0.7}>
                <VisibilityIcon fontSize="small" />
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Views: {lesson.viewCount}
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={0.7}>
                <CalendarTodayIcon fontSize="small" />
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
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
                fontWeight: 700,
                px: 4,
                py: 1.5,
                fontSize: "1rem",
                borderRadius: 3,
                boxShadow: "0 6px 16px rgb(46 125 50 / 0.35)",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "#2e7d32",
                  boxShadow: "0 8px 22px rgb(46 125 50 / 0.6)",
                },
              }}
            >
              {isDownloading ? "Processing..." : "Download"}
            </Button>
          </Stack>
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
    </ThemeProvider>
  );
};

export default LessonViewer;
