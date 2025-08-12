import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Alert,
  Stack,
  styled,
  keyframes,
} from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  CheckCircle as CheckCircleIcon,
  HourglassEmpty as HourglassEmptyIcon,
  Visibility as VisibilityIcon,
  Download as DownloadIcon,
  EventNote as EventNoteIcon,
  BarChart as BarChartIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";
import contentService from "../../services/contentService";
import { jwtDecode } from "jwt-decode";

// Color palette matching MyUploads
const colors = {
  primary: "#1976d2",
  secondary: "#4fc3f7",
  accent: "#FFC107",
  darkBg: "#0a1929",
  lightText: "#f5f5f5",
  glassBorder: "rgba(255, 255, 255, 0.1)",
};

// Animations
const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
  100% { transform: translateY(0px); }
`;

const pulseAnimation = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(25, 118, 210, 0.4); }
  70% { transform: scale(1.05); box-shadow: 0 0 0 12px rgba(25, 118, 210, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(25, 118, 210, 0); }
`;

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Styled components
const GlassPanel = styled(Paper)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  borderRadius: "24px",
  boxShadow: "0 12px 40px rgba(0, 0, 0, 0.1)",
  padding: theme.spacing(4),
  width: "100%",
  maxWidth: "1400px",
  border: "1px solid rgba(0, 0, 0, 0.08)",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "6px",
    background: `linear-gradient(90deg, ${colors.primary}, ${colors.accent})`,
    borderRadius: "24px 24px 0 0",
  },
  "&::after": {
    content: '""',
    position: "absolute",
    top: "-50%",
    left: "-50%",
    width: "200%",
    height: "200%",
    background: `linear-gradient(45deg, 
      transparent 0%, 
      rgba(25, 118, 210, 0.03) 30%, 
      transparent 50%, 
      rgba(255, 193, 7, 0.03) 70%, 
      transparent 100%)`,
    animation: `${gradientAnimation} 12s ease infinite`,
    backgroundSize: "400% 400%",
    zIndex: 0,
  },
}));

const StatCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: "16px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  width: "100%",
  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
  transition: "all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)",
  cursor: "default",
  position: "relative",
  overflow: "hidden",
  zIndex: 1,
  background: "white",
  border: "1px solid rgba(0, 0, 0, 0.05)",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: "0 16px 32px rgba(0, 0, 0, 0.15)",
    "&::before": {
      opacity: 1,
    },
  },
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "4px",
    background: `linear-gradient(90deg, ${colors.primary}, ${colors.accent})`,
    opacity: 0.7,
    transition: "opacity 0.4s ease",
  },
}));

const AnimatedIconWrapper = styled(Box)({
  display: "inline-flex",
  justifyContent: "center",
  alignItems: "center",
  width: "60px",
  height: "60px",
  borderRadius: "50%",
  marginBottom: "16px",
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    border: `2px solid ${colors.primary}`,
    animation: `${pulseAnimation} 3s infinite`,
    opacity: 0.3,
  },
});

const getUploaderIdFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return Number(decoded.userId || decoded.sub);
  } catch (error) {
    console.error("Failed to decode token", error);
    return null;
  }
};

const UploadStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        const uploaderId = getUploaderIdFromToken();
        if (!uploaderId) {
          throw new Error("You must be logged in to view stats");
        }

        const lessons = await contentService.getLessonsByUploader(uploaderId);

        const totalUploads = lessons.length;
        const approvedUploads = lessons.filter((l) => l.approved).length;
        const pendingUploads = totalUploads - approvedUploads;
        const totalViews = lessons.reduce(
          (sum, l) => sum + (l.viewCount || 0),
          0
        );
        const totalDownloads = lessons.reduce(
          (sum, l) => sum + (l.downloadCount || 0),
          0
        );

        setStats({
          totalUploads,
          approvedUploads,
          pendingUploads,
          totalViews,
          totalDownloads,
        });
      } catch (err) {
        setError(err.message || "Failed to fetch upload statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="300px"
      >
        <CircularProgress
          size={80}
          thickness={4}
          sx={{
            color: colors.primary,
            "& .MuiCircularProgress-circle": {
              strokeLinecap: "round",
            },
          }}
        />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <Alert
          severity="error"
          sx={{
            width: "100%",
            maxWidth: 600,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            borderLeft: `4px solid ${colors.primary}`,
          }}
        >
          {error}
        </Alert>
      </Box>
    );
  }

  const statItems = [
    {
      label: "Total Uploads",
      value: stats.totalUploads,
      icon: (
        <CloudUploadIcon
          sx={{
            fontSize: 32,
            color: colors.primary,
          }}
        />
      ),
      bgColor: "rgba(25, 118, 210, 0.1)",
      animation: `${floatAnimation} 4s ease-in-out infinite`,
    },
    {
      label: "Approved Uploads",
      value: stats.approvedUploads,
      icon: (
        <CheckCircleIcon
          sx={{
            fontSize: 32,
            color: "#388e3c",
          }}
        />
      ),
      bgColor: "rgba(56, 142, 60, 0.1)",
      animation: `${pulseAnimation} 3s infinite`,
    },
    {
      label: "Pending Uploads",
      value: stats.pendingUploads,
      icon: (
        <HourglassEmptyIcon
          sx={{
            fontSize: 32,
            color: "#ff9800",
          }}
        />
      ),
      bgColor: "rgba(255, 152, 0, 0.1)",
      animation: `${floatAnimation} 3.5s ease-in-out infinite`,
    },
    {
      label: "Total Views",
      value: stats.totalViews,
      icon: (
        <VisibilityIcon
          sx={{
            fontSize: 32,
            color: colors.accent,
          }}
        />
      ),
      bgColor: "rgba(255, 193, 7, 0.1)",
      animation: `${floatAnimation} 3.2s ease-in-out infinite`,
    },
    {
      label: "Total Downloads",
      value: stats.totalDownloads,
      icon: (
        <DownloadIcon
          sx={{
            fontSize: 32,
            color: colors.secondary,
          }}
        />
      ),
      bgColor: "rgba(79, 195, 247, 0.1)",
      animation: `${floatAnimation} 4.2s ease-in-out infinite`,
    },
    {
      label: "Approval Rate",
      value:
        stats.totalUploads > 0
          ? Math.round((stats.approvedUploads / stats.totalUploads) * 100)
          : 0,
      unit: "%",
      icon: (
        <TrendingUpIcon
          sx={{
            fontSize: 32,
            color: "#9c27b0",
          }}
        />
      ),
      bgColor: "rgba(156, 39, 176, 0.1)",
      animation: `${floatAnimation} 3.8s ease-in-out infinite`,
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: 8,
        px: { xs: 2, sm: 4 },
      }}
    >
      <Box display="flex" justifyContent="center">
        <GlassPanel elevation={3}>
          {/* Header */}
          <Box mb={6} position="relative" zIndex={1}>
            <Stack direction="row" alignItems="center" spacing={2} mb={2}>
              <BarChartIcon
                sx={{
                  fontSize: 48,
                  color: colors.primary,
                  animation: `${floatAnimation} 3s ease-in-out infinite`,
                }}
              />
              <Typography
                variant="h2"
                component="h1"
                fontWeight="700"
                color="text.primary"
                sx={{
                  letterSpacing: "-1px",
                  mb: 0.5,
                  background: `linear-gradient(90deg, ${colors.primary}, ${colors.accent})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Upload Statistics
              </Typography>
            </Stack>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <EventNoteIcon fontSize="small" />
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Typography>
          </Box>

          {/* Stats Cards */}
          <Grid
            container
            spacing={4}
            justifyContent="center"
            position="relative"
            zIndex={1}
          >
            {statItems.map(
              ({ label, value, icon, bgColor, animation, unit }, idx) => (
                <Grid
                  key={idx}
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  sx={{ display: "flex" }}
                >
                  <StatCard
                    sx={{
                      background: bgColor,
                    }}
                  >
                    <AnimatedIconWrapper sx={{ animation }}>
                      {icon}
                    </AnimatedIconWrapper>
                    <Typography
                      variant="subtitle1"
                      fontWeight="medium"
                      sx={{
                        flexGrow: 1,
                        color: "text.secondary",
                        mb: 1,
                        textTransform: "uppercase",
                        letterSpacing: "1px",
                        fontSize: "0.9rem",
                      }}
                    >
                      {label}
                    </Typography>
                    <Typography
                      variant="h3"
                      fontWeight="bold"
                      sx={{
                        color: "text.primary",
                        background: `linear-gradient(90deg, ${colors.primary}, ${colors.accent})`,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      {value.toLocaleString()}
                      {unit && (
                        <span style={{ fontSize: "1.5rem" }}>{unit}</span>
                      )}
                    </Typography>
                  </StatCard>
                </Grid>
              )
            )}
          </Grid>
        </GlassPanel>
      </Box>
    </Box>
  );
};

export default UploadStats;
