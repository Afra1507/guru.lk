// src/pages/Lessons.jsx

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
          mt: 8,
        }}
      >
        <CircularProgress color="primary" size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 6 }}>
        <Alert
          severity="error"
          icon={<ErrorOutlineIcon fontSize="inherit" />}
          sx={{ fontWeight: "600" }}
        >
          Error loading lessons: {error.toString()}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      <Typography
        variant="h4"
        component="h2"
        gutterBottom
        sx={{
          fontWeight: "700",
          letterSpacing: 1,
          color: "#031227ff",
          textAlign: "center",
          mb: 4,
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        Available Lessons
      </Typography>

      {/* Paper wrapper for search filter with padding and shadow */}
      <Paper
        elevation={3}
        sx={{
          maxWidth: 900,
          mx: "auto",
          p: 3,
          mb: 4,
          borderRadius: 2,
          bgcolor: "#f9fafb",
        }}
      >
        <SearchFilter onFilter={handleFilter} />
      </Paper>

      <Grid container spacing={4} justifyContent="center" sx={{ mt: 1 }}>
        {filteredLessons.length > 0 ? (
          filteredLessons.map((lesson) => (
            <Grid
              item
              key={lesson.lessonId}
              xs={12}
              sm={6}
              md={4}
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <ContentCard
                lesson={lesson}
                createDownload={createDownload}
                sx={{ width: "100%", maxWidth: 350 }}
              />
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Alert
              severity="info"
              icon={<InfoIcon fontSize="inherit" />}
              sx={{ fontWeight: "600", textAlign: "center" }}
            >
              {lessons.length === 0
                ? "No lessons available"
                : "No lessons match your filter criteria"}
            </Alert>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default Lessons;
