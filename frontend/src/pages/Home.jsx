import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import {
  Container,
  Grid,
  Typography,
  Button,
  Alert,
  Box,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";

import SearchFilter from "../components/content/SearchFilter";
import ContentCard from "../components/content/ContentCard";
import contentService from "../services/contentService";

import { useAuth } from "../auth/useAuth"; // Your auth hook

const sliderImages = [
  {
    src: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1350&q=80",
    alt: "Group study and collaboration",
    caption: "Collaborate and Learn Together",
  },
  {
    src: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=1350&q=80",
    alt: "Open book and laptop for knowledge sharing",
    caption: "Share Your Knowledge with the Community",
  },
  {
    src: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1350&q=80",
    alt: "Person writing notes and learning",
    caption: "Grow Your Skills and Help Others",
  },
];

const Home = () => {
  const { user, logout } = useAuth();
  const [showWelcome, setShowWelcome] = useState(false);
  const [popularLessons, setPopularLessons] = useState([]);
  const [loadingPopular, setLoadingPopular] = useState(true);
  const [errorPopular, setErrorPopular] = useState(null);

  const navigate = useNavigate();

  // Show welcome alert on login
  useEffect(() => {
    if (user) {
      setShowWelcome(true);
    } else {
      setShowWelcome(false);
    }
  }, [user]);

  // Hide welcome after 5 seconds
  useEffect(() => {
    if (showWelcome) {
      const timer = setTimeout(() => setShowWelcome(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showWelcome]);

  // Fetch popular lessons on mount (same for all roles)
  useEffect(() => {
    setLoadingPopular(true);
    setErrorPopular(null);
    contentService
      .getPopularLessons()
      .then((data) => {
        setPopularLessons(data);
        setLoadingPopular(false);
      })
      .catch((err) => {
        setErrorPopular("Failed to load popular lessons.");
        setLoadingPopular(false);
        console.error(err);
      });
  }, []);

  const handleLogin = () => navigate("/login");
  const handleRegister = () => navigate("/register");
  const handleLogout = () => {
    logout();
    window.location.href = "/login"; // reload + redirect
  };

  const handleProfileRedirect = () => {
    if (user?.role === "ADMIN") {
      navigate("/admin");
    } else {
      navigate("/profile");
    }
  };

  const getWelcomeMessage = () => {
    if (!user) return null;
    switch (user.role) {
      case "ADMIN":
        return "Welcome, Admin!";
      case "CONTRIBUTOR":
        return "Welcome, Contributor!";
      case "LEARNER":
      default:
        return "Welcome, Learner!";
    }
  };

  const role = user?.role;

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: true,
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 3, mb: 6 }}>
      {/* Header Section */}
      <Grid
        container
        alignItems="center"
        spacing={2}
        sx={{ mb: 4 }}
        justifyContent="space-between"
      >
        <Grid item xs={12} md={8}>
          <Typography variant="h3" component="h1" gutterBottom>
            Welcome to GURU.Ik
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Community Knowledge Sharing Platform for All Sri Lankans
          </Typography>
        </Grid>

        <Grid
          item
          xs="auto"
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          {user ? (
            <>
              <Button
                startIcon={<PersonIcon />}
                variant={role === "ADMIN" ? "contained" : "outlined"}
                color={role === "ADMIN" ? "error" : "primary"}
                onClick={handleProfileRedirect}
                size="large"
                sx={{ textTransform: "capitalize", fontWeight: "600" }}
              >
                {role === "ADMIN" ? "Admin Dashboard" : "My Profile"}
              </Button>
              <Button
                startIcon={<LogoutIcon />}
                variant="outlined"
                color="error"
                onClick={handleLogout}
                size="large"
                sx={{ textTransform: "capitalize", fontWeight: "600" }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                startIcon={<LoginIcon />}
                variant="contained"
                color="primary"
                onClick={handleLogin}
                size="large"
                sx={{ textTransform: "capitalize", fontWeight: "600" }}
              >
                Login
              </Button>
              <Button
                startIcon={<AppRegistrationIcon />}
                variant="outlined"
                color="primary"
                onClick={handleRegister}
                size="large"
                sx={{ textTransform: "capitalize", fontWeight: "600" }}
              >
                Register
              </Button>
            </>
          )}
        </Grid>
      </Grid>

      {/* Contributor Notice */}
      {role === "CONTRIBUTOR" && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Welcome, contributor! Head to your profile to upload or edit your
          lessons.
        </Alert>
      )}

      {/* Admin Notice */}
      {role === "ADMIN" && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          You have admin privileges. Use the admin tools below to manage users
          and review content.
        </Alert>
      )}

      {/* Image Slider */}
      <Box sx={{ mb: 5 }}>
        <Slider {...sliderSettings}>
          {sliderImages.map(({ src, alt, caption }, idx) => (
            <Box
              key={idx}
              sx={{
                position: "relative",
                borderRadius: 3,
                overflow: "hidden",
                height: { xs: 180, sm: 300, md: 400 },
                boxShadow: 3,
              }}
            >
              <img
                src={src}
                alt={alt}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                loading="lazy"
              />
              <Box
                sx={{
                  position: "absolute",
                  bottom: 20,
                  left: 20,
                  color: "white",
                  bgcolor: "rgba(0,0,0,0.6)",
                  px: 2,
                  py: 1,
                  borderRadius: 1,
                  fontWeight: "bold",
                  fontSize: { xs: "1rem", sm: "1.25rem" },
                  maxWidth: "70%",
                  userSelect: "none",
                }}
              >
                {caption}
              </Box>
            </Box>
          ))}
        </Slider>
      </Box>

      {/* Welcome Message */}
      {user && showWelcome && (
        <Alert severity="success" sx={{ mb: 3, textAlign: "center" }}>
          {getWelcomeMessage()}
        </Alert>
      )}

      {/* Filters */}
      <Box sx={{ mb: 5 }}>
        <SearchFilter />
      </Box>

      {/* Popular Lessons */}
      <Typography variant="h4" gutterBottom>
        Top Viewed Lessons
      </Typography>

      {loadingPopular ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
          <CircularProgress />
        </Box>
      ) : errorPopular ? (
        <Alert severity="error" sx={{ my: 3 }}>
          {errorPopular}
        </Alert>
      ) : popularLessons.length === 0 ? (
        <Typography variant="body1" color="text.secondary" sx={{ mt: 3 }}>
          No popular lessons available yet.
        </Typography>
      ) : (
        <Grid container spacing={4} sx={{ mt: 1 }}>
          {popularLessons.map((lesson) => (
            <Grid item key={lesson.id || lesson.lessonId} xs={12} sm={6} md={4}>
              <ContentCard lesson={lesson} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Browse Button */}
      <Box sx={{ textAlign: "center", mt: 6 }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => navigate("/lessons")}
        >
          Browse All Lessons
        </Button>
      </Box>

      {/* Admin-only Section */}
      {role === "ADMIN" && (
        <Box sx={{ mt: 8 }}>
          <Typography variant="h5" gutterBottom>
            Admin Tools
          </Typography>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => navigate("/admin/users")}
            >
              Manage Users
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => navigate("/admin/analytics")}
            >
              Review Content
            </Button>
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default Home;
