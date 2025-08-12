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
  styled,
  keyframes,
} from "@mui/material";
import {
  Visibility as ViewsIcon,
  MenuBook as LessonsIcon,
  Subject as SubjectsIcon,
  Language as LanguagesIcon,
  Category as CategoriesIcon,
  People as UsersIcon,
  ThumbUp as LikesIcon,
  Verified as ApprovedIcon,
  HourglassBottom as PendingIcon,
  CloudUpload as UploadsIcon,
  Star as StarIcon,
  AccessTime as TimeIcon,
  BarChart as AnalyticsIcon,
  TrendingUp as TrendingIcon,
} from "@mui/icons-material";
import { useContent } from "../hooks/useContent";

// Animation keyframes
const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-4px); }
  100% { transform: translateY(0px); }
`;

const pulseAnimation = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(0, 31, 84, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(0, 31, 84, 0); }
  100% { box-shadow: 0 0 0 0 rgba(0, 31, 84, 0); }
`;

// Styled components
const StatCard = styled(Card)(({ theme, color }) => ({
  height: "100%",
  borderRadius: "16px",
  padding: theme.spacing(3),
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: theme.spacing(1.5),
  cursor: "default",
  transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
  background: theme.palette.background.paper,
  boxShadow: `0 8px 24px ${theme.palette.primary.light}20`,
  border: `1px solid ${theme.palette.divider}`,
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: `0 16px 32px ${color}40`,
    "& .stat-icon": {
      animation: `${floatAnimation} 2s ease-in-out infinite`,
    },
  },
}));

const StatIconWrapper = styled(Box)(({ theme, color }) => ({
  width: "64px",
  height: "64px",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: `linear-gradient(135deg, ${color}, ${theme.palette.getContrastText(
    color
  )})`,
  color: "white",
  boxShadow: theme.shadows[4],
  marginBottom: theme.spacing(1),
}));

const LessonCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  borderRadius: "16px",
  overflow: "hidden",
  transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
  background: theme.palette.background.paper,
  boxShadow: `0 8px 24px ${theme.palette.primary.light}20`,
  border: `1px solid ${theme.palette.divider}`,
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: `0 16px 32px ${theme.palette.primary.light}40`,
  },
}));

const LoadingSpinner = () => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "40vh",
    }}
  >
    <CircularProgress size={60} thickness={4} sx={{ color: "primary.main" }} />
  </Box>
);

const statsConfig = [
  {
    key: "totalViews",
    label: "Total Views",
    icon: <ViewsIcon />,
    color: "#3f51b5", // indigo
  },
  {
    key: "totalLessons",
    label: "Total Lessons",
    icon: <LessonsIcon />,
    color: "#2196f3", // blue
  },
  {
    key: "totalSubjects",
    label: "Subjects",
    icon: <SubjectsIcon />,
    color: "#4caf50", // green
  },
  {
    key: "totalContentTypes",
    label: "Content Types",
    icon: <CategoriesIcon />,
    color: "#9c27b0", // purple
  },
  {
    key: "totalUsers",
    label: "Total Users",
    icon: <UsersIcon />,
    color: "#607d8b", // blue grey
  },
  {
    key: "totalLikes",
    label: "Total Likes",
    icon: <LikesIcon />,
    color: "#e91e63", // pink
  },
  {
    key: "totalApproved",
    label: "Approved",
    icon: <ApprovedIcon />,
    color: "#00bcd4", // cyan
  },
  {
    key: "totalPending",
    label: "Pending",
    icon: <PendingIcon />,
    color: "#ff5722", // deep orange
  },
  {
    key: "totalUploads",
    label: "Uploads",
    icon: <UploadsIcon />,
    color: "#795548", // brown
  },
];

const LessonAnalytics = () => {
  const { getContentAnalytics, loading } = useContent();
  const [analytics, setAnalytics] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    getContentAnalytics().then(setAnalytics).catch(console.error);
  }, [getContentAnalytics]);

  if (loading) return <LoadingSpinner />;

  if (!analytics)
    return (
      <Typography
        align="center"
        variant="h6"
        sx={{ mt: 6, color: "text.secondary" }}
      >
        No analytics data available
      </Typography>
    );

  const topViewedLessonsKey = Object.keys(analytics).find(
    (key) => key.toLowerCase().includes("top") && Array.isArray(analytics[key])
  );
  const topViewedLessons = topViewedLessonsKey
    ? analytics[topViewedLessonsKey]
    : [];

  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      

      {/* Top Viewed Lessons */}
      {topViewedLessons.length > 0 && (
        <>
          <Divider sx={{ my: 6, borderColor: "divider", borderWidth: 1 }} />
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Stack
              direction="row"
              spacing={2}
              justifyContent="center"
              alignItems="center"
            >
              <TrendingIcon sx={{ fontSize: 40, color: "primary.main" }} />
              <Typography
                variant="h4"
                fontWeight={700}
                sx={{ color: "primary.main" }}
              >
                Top Viewed Lessons
              </Typography>
            </Stack>
          </Box>
          <Grid container spacing={4}>
            {topViewedLessons.map((lesson) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={lesson.lessonId}>
                <LessonCard>
                  <Box
                    sx={{
                      p: 3,
                      borderBottom: `1px solid ${theme.palette.divider}`,
                      backgroundColor: "action.hover",
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <LessonsIcon color="primary" sx={{ fontSize: 32 }} />
                    <Typography
                      variant="h6"
                      fontWeight={700}
                      noWrap
                      sx={{ flexGrow: 1 }}
                    >
                      {lesson.title}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <ViewsIcon color="primary" />
                      <Typography variant="body1" fontWeight={600}>
                        {lesson.viewCount}
                      </Typography>
                    </Stack>
                  </Box>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      mb={3}
                      sx={{
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {lesson.description || "No description available"}
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <SubjectsIcon fontSize="small" color="primary" />
                          <Typography variant="caption">
                            {lesson.subject || "N/A"}
                          </Typography>
                        </Stack>
                      </Grid>
                      <Grid item xs={6}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <CategoriesIcon fontSize="small" color="primary" />
                          <Typography variant="caption">
                            {lesson.contentType || "N/A"}
                          </Typography>
                        </Stack>
                      </Grid>
                      <Grid item xs={6}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <TimeIcon fontSize="small" color="primary" />
                          <Typography variant="caption">
                            {lesson.duration || "N/A"}
                          </Typography>
                        </Stack>
                      </Grid>
                    </Grid>
                  </CardContent>
                  <Box
                    sx={{
                      p: 2,
                      borderTop: `1px solid ${theme.palette.divider}`,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <StarIcon fontSize="small" color="warning" />
                      <Typography variant="body2" fontWeight={600}>
                        {lesson.rating ? `${lesson.rating}/5` : "N/A"}
                      </Typography>
                    </Stack>
                    <Typography variant="caption" color="text.secondary">
                      Last updated:{" "}
                      {new Date(lesson.updatedAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                </LessonCard>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {/* Summary Stats */}
      <Grid container spacing={4} sx={{ mb: 8 }}>
        {statsConfig.map((stat) => (
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={stat.key}>
            <StatCard color={stat.color}>
              <StatIconWrapper color={stat.color} className="stat-icon">
                {React.cloneElement(stat.icon, { sx: { fontSize: 28 } })}
              </StatIconWrapper>
              <Typography
                variant="subtitle1"
                fontWeight={600}
                color="text.secondary"
              >
                {stat.label}
              </Typography>
              <Typography
                variant="h3"
                fontWeight={800}
                sx={{ color: stat.color }}
              >
                {analytics[stat.key] || 0}
              </Typography>
            </StatCard>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default LessonAnalytics;
