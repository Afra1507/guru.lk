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
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import EventNoteIcon from "@mui/icons-material/EventNote";
import contentService from "../../services/contentService";
import { jwtDecode } from "jwt-decode";

// Color palette
const colors = {
  primary: "#1976d2",
  secondary: "#4fc3f7",
  accent: "#FFC107",
  darkBg: "#0a1929",
  lightText: "#f5f5f5",
  glassBorder: "rgba(255, 255, 255, 0.1)",
};

// Animation keyframes
const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-3px); }
  100% { transform: translateY(0px); }
`;

const pulseAnimation = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(25, 118, 210, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(25, 118, 210, 0); }
  100% { box-shadow: 0 0 0 0 rgba(25, 118, 210, 0); }
`;

// Styled components
const GlassPanel = styled(Paper)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  borderRadius: "16px",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
  padding: theme.spacing(4),
  width: "100%",
  maxWidth: "1200px",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "4px",
    background: `linear-gradient(90deg, ${colors.primary}, ${colors.accent})`,
    borderRadius: "16px 16px 0 0",
  },
}));

const StatCard = styled(Paper)(({ theme }) => ({
  p: 3,
  borderRadius: 3,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  width: "100%",
  boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  cursor: "default",
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: "rgba(0, 0, 0, 0.25) 0px 8px 20px",
  },
}));

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
        const totalViews = lessons.reduce((sum, l) => sum + (l.viewCount || 0), 0);
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
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <Alert severity="error" sx={{ width: "100%", maxWidth: 600 }}>
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
            fontSize: 30,
            color: colors.primary,
            animation: `${floatAnimation} 3s ease-in-out infinite`,
          }}
        />
      ),
      bgColor: "rgba(25, 118, 210, 0.1)",
    },
    {
      label: "Approved Uploads",
      value: stats.approvedUploads,
      icon: (
        <CheckCircleIcon
          sx={{
            fontSize: 30,
            color: "#388e3c",
            animation: `${pulseAnimation} 2s infinite`,
          }}
        />
      ),
      bgColor: "rgba(56, 142, 60, 0.1)",
    },
    {
      label: "Pending Uploads",
      value: stats.pendingUploads,
      icon: (
        <HourglassEmptyIcon
          sx={{ fontSize: 30, color: "#ff9800", animation: `${floatAnimation} 3s ease-in-out infinite` }}
        />
      ),
      bgColor: "rgba(255, 152, 0, 0.1)",
    },
    {
      label: "Total Views",
      value: stats.totalViews,
      icon: (
        <VisibilityIcon
          sx={{ fontSize: 30, color: colors.accent }}
        />
      ),
      bgColor: "rgba(255, 193, 7, 0.1)",
    },
    {
      label: "Total Downloads",
      value: stats.totalDownloads,
      icon: (
        <DownloadIcon
          sx={{ fontSize: 30, color: colors.secondary }}
        />
      ),
      bgColor: "rgba(79, 195, 247, 0.1)",
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8ed 100%)",
        py: 8,
        px: { xs: 2, sm: 4 },
      }}
    >
      <Box display="flex" justifyContent="center">
        <GlassPanel elevation={3}>
          {/* Header */}
          <Box mb={4}>
            <Typography
              variant="h3"
              component="h1"
              fontWeight="700"
              color="text.primary"
              sx={{
                letterSpacing: "-0.5px",
                mb: 0.5,
              }}
            >
              Upload Statistics
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <EventNoteIcon fontSize="small" />
              {new Date().toLocaleDateString("en-US", {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </Typography>
          </Box>

          {/* Stats Cards */}
          <Grid container spacing={3} justifyContent="center">
            {statItems.map(({ label, value, icon, bgColor }, idx) => (
              <Grid
                key={idx}
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                sx={{ display: "flex" }}
              >
                <StatCard
                  sx={{
                    background: bgColor,
                  }}
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    mb={1}
                    sx={{ justifyContent: "center", width: "100%" }}
                  >
                    {icon}
                    <Typography
                      variant="subtitle1"
                      fontWeight="medium"
                      sx={{ flexGrow: 1 }}
                    >
                      {label}
                    </Typography>
                  </Stack>
                  <Typography variant="h4" fontWeight="bold" color="text.primary">
                    {value.toLocaleString()}
                  </Typography>
                </StatCard>
              </Grid>
            ))}
          </Grid>
        </GlassPanel>
      </Box>
    </Box>
  );
};

export default UploadStats;