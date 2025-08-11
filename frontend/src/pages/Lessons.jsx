import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  CircularProgress,
  Alert,
  Typography,
  Box,
  Paper,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ContentCard from "../components/content/ContentCard";
import SearchFilter from "../components/content/SearchFilter";
import { useContent } from "../hooks/useContent";

const Lessons = () => {
  const [lessons, setLessons] = useState([]);
  const [filteredLessons, setFilteredLessons] = useState([]);
  const { getApprovedLessons, createDownload, loading, error } = useContent();

  useEffect(() => {
    const loadLessons = async () => {
      try {
        const data = await getApprovedLessons();
        if (!Array.isArray(data)) {
          console.error("Expected array but received:", typeof data, data);
          throw new Error("Invalid data format received from server");
        }

        setLessons(data);
        setFilteredLessons(data);
      } catch (err) {
        console.error("Failed to load lessons:", err);
        setLessons([]);
        setFilteredLessons([]);
      }
    };

    loadLessons();
  }, [getApprovedLessons]);

  const handleFilter = ({ searchTerm, language, subject, ageGroup }) => {
    let filtered = [...lessons];

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (lesson) =>
          lesson.title.toLowerCase().includes(lower) ||
          lesson.description.toLowerCase().includes(lower) ||
          lesson.subject.toLowerCase().includes(lower)
      );
    }

    if (language !== "all") {
      filtered = filtered.filter(
        (lesson) => lesson.language.toLowerCase() === language.toLowerCase()
      );
    }

    if (subject !== "all") {
      filtered = filtered.filter(
        (lesson) => lesson.subject.toLowerCase() === subject.toLowerCase()
      );
    }

    if (ageGroup !== "all") {
      filtered = filtered.filter(
        (lesson) => lesson.ageGroup.toLowerCase() === ageGroup.toLowerCase()
      );
    }

    setFilteredLessons(filtered);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress
          size={60}
          thickness={4}
          sx={{
            color: "#1976d2",
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
      <Container maxWidth="md" sx={{ mt: 8 }}>
        <Alert
          severity="error"
          icon={<ErrorOutlineIcon fontSize="inherit" />}
          sx={{
            fontWeight: 500,
            bgcolor: "rgba(255, 235, 238, 0.9)",
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(213, 0, 0, 0.1)",
            color: "#d32f2f",
            fontSize: "0.95rem",
            "& .MuiAlert-icon": {
              alignItems: "center",
            },
          }}
        >
          Error loading lessons: {error.toString()}
        </Alert>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f8fafc",
        py: { xs: 4, md: 6 },
        px: { xs: 2, sm: 4, lg: 8 },
      }}
    >
      <Container maxWidth="xl" disableGutters>
        {/* Header Section */}
        <Box
          sx={{
            textAlign: "center",
            mb: { xs: 4, md: 6 },
            px: { xs: 1, sm: 0 },
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 700,
              letterSpacing: "-0.015em",
              color: "#0a1f44",
              mb: 2,
              fontSize: { xs: "2rem", md: "2.5rem" },
              lineHeight: 1.2,
            }}
          >
            Discover Learning Materials
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              color: "#4a5568",
              maxWidth: "700px",
              mx: "auto",
              fontSize: { xs: "0.95rem", md: "1.05rem" },
            }}
          >
            Browse our curated collection of educational resources
          </Typography>
        </Box>

        {/* Search Filter */}
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            p: { xs: 2, md: 3 },
            mb: 6,
            borderRadius: "12px",
            bgcolor: "#ffffff",
            boxShadow: "0 2px 10px rgba(10, 31, 68, 0.08)",
            border: "1px solid rgba(10, 31, 68, 0.05)",
          }}
        >
          <SearchFilter onFilter={handleFilter} />
        </Paper>

        {/* Content Cards Grid */}
        <Box
          sx={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(1, 1fr)",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
              lg: "repeat(4, 1fr)",
            },
            gap: { xs: 3, md: 4 },
          }}
        >
          {filteredLessons.length > 0 ? (
            filteredLessons.map((lesson) => (
              <Box
                key={lesson.lessonId}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                  },
                }}
              >
                <ContentCard
                  lesson={lesson}
                  createDownload={createDownload}
                  sx={{
                    width: "100%",
                    maxWidth: "300px",
                  }}
                />
              </Box>
            ))
          ) : (
            <Box
              sx={{
                gridColumn: "1 / -1",
                display: "flex",
                justifyContent: "center",
                mt: 4,
              }}
            >
              <Alert
                severity="info"
                icon={<InfoIcon fontSize="inherit" />}
                sx={{
                  width: "100%",
                  maxWidth: "600px",
                  fontWeight: 500,
                  fontSize: "1rem",
                  bgcolor: "rgba(10, 132, 255, 0.08)",
                  borderRadius: "12px",
                  border: "1px solid rgba(10, 132, 255, 0.15)",
                  color: "#0a1f44",
                  "& .MuiAlert-icon": {
                    color: "#1976d2",
                  },
                }}
              >
                {lessons.length === 0
                  ? "No lessons available at the moment. Please check back later."
                  : "No lessons match your search criteria. Try adjusting your filters."}
              </Alert>
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default Lessons;