import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  useTheme,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import VisibilityIcon from "@mui/icons-material/Visibility";
import BookIcon from "@mui/icons-material/Book";
import SubjectIcon from "@mui/icons-material/Subject";
import LanguageIcon from "@mui/icons-material/Language";
import CategoryIcon from "@mui/icons-material/Category";
import PeopleIcon from "@mui/icons-material/People";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import BarChartIcon from "@mui/icons-material/BarChart";
import { useContent } from "../hooks/useContent";

// Loading spinner component
const LoadingSpinner = () => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "40vh",
    }}
  >
    <CircularProgress />
  </Box>
);

// Updated icon map with colored icons for summary cards
const iconMap = {
  totalViews: (
    <VisibilityIcon fontSize="large" sx={{ color: "#4caf50" }} />
  ),
  totalLessons: <BookIcon fontSize="large" sx={{ color: "#2196f3" }} />,
  totalSubjects: <SubjectIcon fontSize="large" sx={{ color: "#ff9800" }} />,
  totalLanguages: <LanguageIcon fontSize="large" sx={{ color: "#9c27b0" }} />,
  totalContentTypes: <CategoryIcon fontSize="large" sx={{ color: "#f44336" }} />,
  totalUsers: <PeopleIcon fontSize="large" sx={{ color: "#00bcd4" }} />,
  totalLikes: <ThumbUpIcon fontSize="large" sx={{ color: "#e91e63" }} />,
  totalApproved: <CheckCircleIcon fontSize="large" sx={{ color: "#4caf50" }} />,
  totalPending: <HourglassEmptyIcon fontSize="large" sx={{ color: "#ffb300" }} />,
  totalUploads: <CloudUploadIcon fontSize="large" sx={{ color: "#607d8b" }} />,
};

const LessonAnalytics = () => {
  const { getContentAnalytics, loading } = useContent();
  const [analytics, setAnalytics] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    getContentAnalytics()
      .then(setAnalytics)
      .catch(console.error);
  }, [getContentAnalytics]);

  if (loading) return <LoadingSpinner />;

  if (!analytics)
    return (
      <Typography
        align="center"
        variant="h6"
        sx={{ mt: 4, color: theme.palette.text.secondary }}
      >
        No analytics data found.
      </Typography>
    );

  // Extract top viewed lessons array and remove it from summary
  const topViewedLessonsKey = Object.keys(analytics).find(
    (key) => key.toLowerCase().includes("top") && Array.isArray(analytics[key])
  );
  const topViewedLessons = topViewedLessonsKey ? analytics[topViewedLessonsKey] : [];

  const analyticsSummary = Object.entries(analytics).filter(
    ([key]) => key !== topViewedLessonsKey
  );

  // Helper to render top viewed lessons (same as before)
  const renderTopViewed = (lessons) => (
    <Box sx={{ mt: 6, textAlign: "center" }}>
      <Typography
        variant="h5"
        fontWeight="bold"
        gutterBottom
        sx={{ color: theme.palette.primary.main }}
      >
        Top Viewed Lessons
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {lessons.map((lesson) => (
          <Grid item key={lesson.lessonId} xs={12} sm={6} md={4} lg={3}>
            <Card
              elevation={0}
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                textAlign: "left",
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`,
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: `0 8px 20px ${theme.palette.primary.light}`,
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  p: 2,
                  borderBottom: `1px solid ${theme.palette.divider}`,
                }}
              >
                <BookIcon color="primary" sx={{ mr: 1 }} />
                <Typography
                  variant="h6"
                  component="div"
                  sx={{ fontWeight: "600", flexGrow: 1 }}
                >
                  {lesson.title}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    color: theme.palette.text.secondary,
                  }}
                >
                  <VisibilityIcon fontSize="small" sx={{ mr: 0.5 }} />
                  <Typography variant="body2">{lesson.viewCount} views</Typography>
                </Box>
              </Box>
              <CardContent sx={{ pt: 2 }}>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  {lesson.description}
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mr: 2,
                      color: theme.palette.text.secondary,
                    }}
                  >
                    <SubjectIcon fontSize="small" sx={{ mr: 0.5 }} />
                    <Typography variant="caption">{lesson.subject}</Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mr: 2,
                      color: theme.palette.text.secondary,
                    }}
                  >
                    <CategoryIcon fontSize="small" sx={{ mr: 0.5 }} />
                    <Typography variant="caption">{lesson.contentType}</Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      color: theme.palette.text.secondary,
                    }}
                  >
                    <LanguageIcon fontSize="small" sx={{ mr: 0.5 }} />
                    <Typography variant="caption">{lesson.language}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 5, textAlign: "center" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          mb: 4,
          color: theme.palette.primary.main,
        }}
      >
        <BarChartIcon fontSize="large" />
        <Typography variant="h4" fontWeight="bold">
          Content Analytics
        </Typography>
      </Box>

      {/* Summary Analytics Cards - color-coded with nice icons */}
      <Grid container spacing={4} justifyContent="center" sx={{ mb: 6 }}>
        {analyticsSummary.map(([key, value]) => {
          // Normalize key to camelCase style for icon mapping
          const normalizedKey = key
            .replace(/\s/g, "")
            .replace(/^[a-z]/, (m) => m.toLowerCase());

          // Pick icon or fallback icon
          const icon = iconMap[normalizedKey] || (
            <BarChartIcon
              fontSize="large"
              sx={{ color: theme.palette.grey[700] }}
            />
          );

          // Assign card bg color on key or fallback
          const bgColorMap = {
            totalViews: "success.light",
            totalLessons: "info.light",
            totalSubjects: "warning.light",
            totalLanguages: "purple.light",
            totalContentTypes: "error.light",
            totalUsers: "cyan.light",
            totalLikes: "pink.light",
            totalApproved: "success.light",
            totalPending: "warning.light",
            totalUploads: "grey.200",
          };

          // Use MUI theme colors or fallback
          const bgColor = theme.palette[bgColorMap[normalizedKey]?.split(".")[0]]?.[bgColorMap[normalizedKey]?.split(".")[1]] || theme.palette.grey[100];

          return (
            <Grid item xs={6} sm={4} md={3} lg={2.4} key={key}>
              <Card
                elevation={6}
                sx={{
                  height: 140,
                  borderRadius: 3,
                  backgroundColor: bgColor,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                  color: theme.palette.text.primary,
                  textTransform: "capitalize",
                  cursor: "default",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    backgroundColor:
                      theme.palette.mode === "light"
                        ? theme.palette.grey[300]
                        : theme.palette.grey[700],
                    transform: "scale(1.05)",
                    boxShadow:
                      "rgba(0, 0, 0, 0.25) 0px 8px 20px",
                  },
                }}
              >
                <Box>{icon}</Box>
                <Typography variant="subtitle1" fontWeight="600">
                  {key.replace(/([A-Z])/g, " $1")}
                </Typography>
                <Typography variant="h4" fontWeight="bold" sx={{ mt: -0.5 }}>
                  {value}
                </Typography>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Top Viewed Lessons Section */}
      {topViewedLessons.length > 0 && renderTopViewed(topViewedLessons)}
    </Container>
  );
};

export default LessonAnalytics;
