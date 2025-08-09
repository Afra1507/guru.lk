import React, { useEffect, useState } from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Typography,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Box,
} from "@mui/material";
import { useContent } from "../../hooks/useContent";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

// Import MUI Icons
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import VisibilityIcon from "@mui/icons-material/Visibility";
import GetAppIcon from "@mui/icons-material/GetApp";
import EventNoteIcon from "@mui/icons-material/EventNote";

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
        minHeight="200px"
      >
        <CircularProgress size={60} />
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
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="70vh"
      px={2}
      py={4}
    >
      <Paper
        elevation={4}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 900,
          borderRadius: 3,
        }}
      >
        {/* Header */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
          flexWrap="wrap"
          gap={2}
        >
          <Typography
            variant="h4"
            component="h1"
            fontWeight="bold"
            flexGrow={1}
          >
            My Uploads
          </Typography>
          <Button
            variant="contained"
            size="medium"
            startIcon={<CloudUploadIcon />}
            onClick={() => navigate("/contributor/new")}
          >
            Upload New Lesson
          </Button>
        </Box>

        {/* Content */}
        {uploads.length > 0 ? (
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    <Box
                      component="span"
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 0.5,
                      }}
                    >
                      <VisibilityIcon fontSize="small" />
                      Views
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    <Box
                      component="span"
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 0.5,
                      }}
                    >
                      <GetAppIcon fontSize="small" />
                      Downloads
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    <Box
                      component="span"
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 0.5,
                      }}
                    >
                      <EventNoteIcon fontSize="small" />
                      Uploaded
                    </Box>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {uploads.map((upload) => (
                  <TableRow key={upload.lessonId} hover>
                    <TableCell>{upload.title}</TableCell>
                    <TableCell>
                      <Chip
                        icon={
                          upload.approved ? (
                            <CheckCircleIcon />
                          ) : (
                            <HourglassEmptyIcon />
                          )
                        }
                        label={upload.approved ? "Approved" : "Pending"}
                        color={upload.approved ? "success" : "warning"}
                        size="small"
                        sx={{ fontWeight: "bold" }}
                      />
                    </TableCell>
                    <TableCell>{upload.viewCount}</TableCell>
                    <TableCell>{upload.downloadCount || 0}</TableCell>
                    <TableCell>
                      {new Date(upload.createdAt).toLocaleDateString()}
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
            <CloudUploadIcon sx={{ fontSize: 60, color: "primary.main" }} />
            <Typography variant="h6" color="text.secondary" fontWeight="medium">
              You haven't uploaded any lessons yet.
            </Typography>
            <Button
              variant="outlined"
              size="medium"
              onClick={() => navigate("/contributor/new")}
              startIcon={<CloudUploadIcon />}
            >
              Start Uploading
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default MyUploads;
