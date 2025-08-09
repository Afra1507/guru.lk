import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Typography,
  Alert,
  AlertTitle,
  Box,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ContentCard from "../components/content/ContentCard";
import { useContent } from "../hooks/useContent";

const AdminAllLessons = () => {
  const { getAllLessons } = useContent();
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    getAllLessons().then(setLessons).catch(console.error);
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontWeight: 700,
          fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
          letterSpacing: "0.05em",
          color: "#001f54", // navy blue
        }}
      >
        All Lessons (Admin View)
      </Typography>

      {lessons.length === 0 ? (
        <Alert
          severity="info"
          icon={<InfoOutlinedIcon fontSize="inherit" />}
          sx={{ mt: 2 }}
        >
          <AlertTitle>No lessons available.</AlertTitle>
          Please check back later.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {lessons.map((lesson) => (
            <Grid item xs={12} md={6} lg={4} key={lesson.lessonId}>
              <ContentCard lesson={lesson} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default AdminAllLessons;
