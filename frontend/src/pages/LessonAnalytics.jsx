import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Divider,
  Stack,
  useTheme,
} from "@mui/material";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import BookIcon from "@mui/icons-material/Book";
import SubjectIcon from "@mui/icons-material/Subject";
import LanguageIcon from "@mui/icons-material/Language";
import CategoryIcon from "@mui/icons-material/Category";
import PeopleIcon from "@mui/icons-material/People";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import BarChartIcon from "@mui/icons-material/BarChart";
import StarIcon from "@mui/icons-material/Star";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useContent } from "../hooks/useContent";

const LoadingSpinner = () => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "40vh",
    }}
  >
    <CircularProgress size={60} />
  </Box>
);

const iconMap = {
  totalViews: (color) => <VisibilityIcon fontSize="large" sx={{ color }} />,
  totalLessons: (color) => <BookIcon fontSize="large" sx={{ color }} />,
  totalSubjects: (color) => <SubjectIcon fontSize="large" sx={{ color }} />,
  totalLanguages: (color) => <LanguageIcon fontSize="large" sx={{ color }} />,
  totalContentTypes: (color) => <CategoryIcon fontSize="large" sx={{ color }} />,
  totalUsers: (color) => <PeopleIcon fontSize="large" sx={{ color }} />,
  totalLikes: (color) => <ThumbUpIcon fontSize="large" sx={{ color }} />,
  totalApproved: (color) => <VerifiedUserIcon fontSize="large" sx={{ color }} />,
  totalPending: (color) => <HourglassBottomIcon fontSize="large" sx={{ color }} />,
  totalUploads: (color) => <FileUploadIcon fontSize="large" sx={{ color }} />,
};

const bgColorMap = {
  totalViews: "primary.main",
  totalLessons: "info.main",
  totalSubjects: "warning.main",
  totalLanguages: "secondary.main",
  totalContentTypes: "error.main",
  totalUsers: "success.main",
  totalLikes: "pink.main",
  totalApproved: "success.main",
  totalPending: "warning.main",
  totalUploads: "grey.600",
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
        sx={{ mt: 6, color: theme.palette.text.secondary }}
      >
        No analytics data found.
      </Typography>
    );

  const topViewedLessonsKey = Object.keys(analytics).find(
    (key) => key.toLowerCase().includes("top") && Array.isArray(analytics[key])
  );
  const topViewedLessons = topViewedLessonsKey ? analytics[topViewedLessonsKey] : [];

  const analyticsSummary = Object.entries(analytics).filter(
    ([key]) => key !== topViewedLessonsKey
  );

  // Format key to human readable label
  const formatLabel = (key) =>
    key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        justifyContent="center"
        sx={{ mb: 5, color: theme.palette.primary.main }}
      >
        <BarChartIcon fontSize="large" />
        <Typography variant="h4" fontWeight={700}>
          Content Analytics
        </Typography>
      </Stack>

      {/* Summary Cards */}
      <Grid container spacing={4} justifyContent="center">
        {analyticsSummary.map(([key, value]) => {
          const normalizedKey = key.replace(/\s/g, "").replace(/^[a-z]/, (m) => m.toLowerCase());
          const color = theme.palette[bgColorMap[normalizedKey]?.split(".")[0]]?.[bgColorMap[normalizedKey]?.split(".")[1]] || theme.palette.primary.main;

          const icon = iconMap[normalizedKey]
            ? iconMap[normalizedKey](color)
            : <BarChartIcon fontSize="large" sx={{ color }} />;

          return (
            <Grid item xs={6} sm={4} md={3} lg={2.4} key={key}>
              <Card
                elevation={10}
                sx={{
                  height: 160,
                  borderRadius: 4,
                  px: 3,
                  py: 2,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 1.5,
                  cursor: "default",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: `0 10px 25px ${color}80`,
                  },
                }}
              >
                <Box>{icon}</Box>
                <Typography variant="subtitle1" fontWeight={700} color="text.primary">
                  {formatLabel(key)}
                </Typography>
                <Typography variant="h4" fontWeight={800} color={color}>
                  {value}
                </Typography>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Divider */}
      <Divider sx={{ my: 6, mx: "auto", maxWidth: 600 }} />

      {/* Top Viewed Lessons */}
      {topViewedLessons.length > 0 && (
        <Box sx={{ textAlign: "center" }}>
          <Typography
            variant="h5"
            fontWeight="bold"
            gutterBottom
            sx={{ color: theme.palette.primary.main, mb: 4 }}
          >
            Top Viewed Lessons
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {topViewedLessons.map((lesson) => (
              <Grid item key={lesson.lessonId} xs={12} sm={6} md={4} lg={3}>
                <Card
                  elevation={8}
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 4,
                    cursor: "pointer",
                    transition: "transform 0.25s ease, box-shadow 0.25s ease",
                    "&:hover": {
                      transform: "translateY(-10px)",
                      boxShadow: `0 15px 30px ${theme.palette.primary.light}80`,
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      p: 2,
                      borderBottom: `1px solid ${theme.palette.divider}`,
                      backgroundColor: theme.palette.action.hover,
                    }}
                  >
                    <BookIcon color="primary" />
                    <Typography variant="h6" noWrap sx={{ flexGrow: 1, fontWeight: 700 }}>
                      {lesson.title}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={0.5} color={theme.palette.text.secondary}>
                      <VisibilityIcon fontSize="small" />
                      <Typography variant="body2">{lesson.viewCount}</Typography>
                    </Stack>
                  </Box>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" color="text.secondary" mb={2} noWrap>
                      {lesson.description}
                    </Typography>
                    <Stack direction="row" spacing={2} flexWrap="wrap" color={theme.palette.text.secondary}>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <SubjectIcon fontSize="small" />
                        <Typography variant="caption">{lesson.subject}</Typography>
                      </Stack>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <CategoryIcon fontSize="small" />
                        <Typography variant="caption">{lesson.contentType}</Typography>
                      </Stack>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <LanguageIcon fontSize="small" />
                        <Typography variant="caption">{lesson.language}</Typography>
                      </Stack>
                    </Stack>
                  </CardContent>
                  <Box
                    sx={{
                      p: 1,
                      borderTop: `1px solid ${theme.palette.divider}`,
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: 1,
                      color: theme.palette.text.secondary,
                    }}
                  >
                    <StarIcon fontSize="small" color="warning" />
                    <Typography variant="caption">{lesson.rating ?? "N/A"}</Typography>
                    <AccessTimeIcon fontSize="small" />
                    <Typography variant="caption">{lesson.duration ?? "N/A"}</Typography>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  );
};

export default LessonAnalytics;
