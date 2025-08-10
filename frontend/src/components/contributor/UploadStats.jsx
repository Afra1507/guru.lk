import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Alert,
  Stack,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import contentService from "../../services/contentService";
import {jwtDecode} from "jwt-decode";

const UploadStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found, please login.");

        const decoded = jwtDecode(token);
        // You might have id or userId in the token
        const userId = decoded.id || decoded.userId;
        if (!userId) throw new Error("User ID not found in token.");

        const lessons = await contentService.getLessonsByUploader(userId);

        const totalUploads = lessons.length;
        const approvedUploads = lessons.filter((l) => l.isApproved).length;
        const pendingUploads = totalUploads - approvedUploads;

        // Sum viewCount, default to 0 if missing
        const totalViews = lessons.reduce((sum, l) => sum + (l.viewCount || 0), 0);

        // Sum downloadCount, default to 0 if missing
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
        setError(err.message || "Failed to fetch stats");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  if (error)
    return (
      <Alert severity="error" sx={{ mt: 4 }}>
        {error}
      </Alert>
    );

  const statItems = [
    {
      label: "Total Uploads",
      value: stats.totalUploads,
      color: "grey.100",
      icon: <CloudUploadIcon sx={{ fontSize: 30, color: "text.secondary" }} />,
    },
    {
      label: "Approved Uploads",
      value: stats.approvedUploads,
      color: "success.light",
      icon: <CheckCircleIcon sx={{ fontSize: 30, color: "success.dark" }} />,
    },
    {
      label: "Pending Uploads",
      value: stats.pendingUploads,
      color: "warning.light",
      icon: <HourglassEmptyIcon sx={{ fontSize: 30, color: "warning.dark" }} />,
    },
    {
      label: "Total Views",
      value: stats.totalViews,
      color: "info.light",
      icon: <VisibilityIcon sx={{ fontSize: 30, color: "info.dark" }} />,
    },
    {
      label: "Total Downloads",
      value: stats.totalDownloads,
      color: "primary.light",
      icon: <DownloadIcon sx={{ fontSize: 30, color: "primary.dark" }} />,
    },
  ];

  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Grid container spacing={3} justifyContent="center" flexWrap="wrap">
        {statItems.map(({ label, value, color, icon }, idx) => (
          <Grid
            key={idx}
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            sx={{ display: "flex" }}
          >
            <Paper
              elevation={6}
              sx={{
                p: 3,
                bgcolor: color,
                borderRadius: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                width: "100%",
                boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
                transition:
                  "transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease",
                cursor: "default",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: "rgba(0, 0, 0, 0.25) 0px 8px 20px",
                  bgcolor: (theme) => theme.palette.grey[200],
                },
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
                {value ?? 0}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default UploadStats;
