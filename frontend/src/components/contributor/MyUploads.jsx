import React, { useEffect, useState } from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Box,
  Paper,
  styled,
  keyframes,
} from "@mui/material";
import { useContent } from "../../hooks/useContent";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

// Icons
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import VisibilityIcon from "@mui/icons-material/Visibility";
import GetAppIcon from "@mui/icons-material/GetApp";
import EventNoteIcon from "@mui/icons-material/EventNote";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

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

// Color palette
const colors = {
  primary: "#1976d2",
  secondary: "#4fc3f7",
  accent: "#FFC107",
  darkBg: "#0a1929",
  lightText: "#f5f5f5",
  glassBorder: "rgba(255, 255, 255, 0.1)",
};

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

const PremiumButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
  color: "white",
  fontWeight: "bold",
  letterSpacing: "0.5px",
  borderRadius: "12px",
  padding: theme.spacing(1.5, 3),
  boxShadow: "0 4px 14px rgba(25, 118, 210, 0.3)",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: `0 6px 20px rgba(25, 118, 210, 0.4)`,
  },
}));

const StatusChip = styled(Box)(({ theme, approved }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: theme.spacing(0.5),
  padding: theme.spacing(0.5, 1.5),
  borderRadius: "20px",
  background: approved ? "rgba(56, 142, 60, 0.15)" : "rgba(255, 152, 0, 0.15)",
  color: approved ? "#388e3c" : "#ff9800",
  fontWeight: "600",
  fontSize: "0.8rem",
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

const MyUploads = () => {
  const [uploads, setUploads] = useState([]);
  const { fetchUserUploads, loading, error } = useContent();
  const navigate = useNavigate();

  useEffect(() => {
    const loadUploads = async () => {
      const uploaderId = getUploaderIdFromToken();

      if (!uploaderId) {
        alert("You must be logged in.");
        navigate("/login");
        return;
      }

      try {
        const data = await fetchUserUploads(uploaderId);
        setUploads(data);
      } catch (err) {
        console.error(err);
      }
    };

    loadUploads();
  }, [fetchUserUploads, navigate]);

  if (loading)
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

  if (error)
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <Alert severity="error" sx={{ width: "100%", maxWidth: 600 }}>
          {error}
        </Alert>
      </Box>
    );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: 8,
        px: { xs: 2, sm: 4 },
      }}
    >
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="calc(100vh - 128px)"
      >
        <GlassPanel elevation={3}>
          {/* Header */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={4}
            flexWrap="wrap"
            gap={2}
          >
            <Box>
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
                My Uploads
              </Typography>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
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

            <PremiumButton
              startIcon={<CloudUploadIcon />}
              onClick={() => navigate("/contributor/new")}
            >
              New Upload
            </PremiumButton>
          </Box>

          {/* Content */}
          {uploads.length > 0 ? (
            <TableContainer component={Box}>
              <Table sx={{ minWidth: 650 }} aria-label="uploads table">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "700", fontSize: "0.9rem" }}>
                      Lesson Title
                    </TableCell>
                    <TableCell sx={{ fontWeight: "700", fontSize: "0.9rem" }}>
                      Status
                    </TableCell>
                    <TableCell sx={{ fontWeight: "700", fontSize: "0.9rem" }}>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <VisibilityIcon fontSize="small" />
                        Views
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontWeight: "700", fontSize: "0.9rem" }}>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <GetAppIcon fontSize="small" />
                        Downloads
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontWeight: "700", fontSize: "0.9rem" }}>
                      Date
                    </TableCell>
                    <TableCell sx={{ fontWeight: "700", fontSize: "0.9rem" }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {uploads.map((upload) => (
                    <TableRow
                      key={upload.lessonId}
                      hover
                      sx={{ "&:last-child td": { borderBottom: 0 } }}
                    >
                      <TableCell sx={{ fontWeight: "500" }}>
                        {upload.title}
                      </TableCell>
                      <TableCell>
                        <StatusChip approved={upload.approved}>
                          {upload.approved ? (
                            <CheckCircleIcon fontSize="small" />
                          ) : (
                            <HourglassEmptyIcon fontSize="small" />
                          )}
                          {upload.approved ? "Approved" : "Pending"}
                        </StatusChip>
                      </TableCell>
                      <TableCell>{upload.viewCount}</TableCell>
                      <TableCell>{upload.downloadCount || 0}</TableCell>
                      <TableCell>
                        {new Date(upload.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          size="small"
                          endIcon={<ArrowForwardIcon />}
                          onClick={() =>
                            navigate(`/lessons/${upload.lessonId}`)
                          }
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box
              textAlign="center"
              py={8}
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap={3}
            >
              <CloudUploadIcon
                sx={{
                  fontSize: 80,
                  color: colors.primary,
                  animation: `${floatAnimation} 3s ease-in-out infinite`,
                }}
              />
              <Typography
                variant="h5"
                fontWeight="600"
                color="text.primary"
                sx={{ maxWidth: "500px" }}
              >
                You haven't uploaded any lessons yet
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ maxWidth: "500px", mb: 2 }}
              >
                Start sharing your knowledge with the community by uploading
                your first lesson.
              </Typography>
              <PremiumButton
                startIcon={<CloudUploadIcon />}
                onClick={() => navigate("/contributor/new")}
              >
                Upload Your First Lesson
              </PremiumButton>
            </Box>
          )}
        </GlassPanel>
      </Box>
    </Box>
  );
};

export default MyUploads;
