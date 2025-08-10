// src/pages/Home.jsx
import React, { useEffect, useState, useRef } from "react";
import Slider from "react-slick";
import {
  Container,
  Grid,
  Typography,
  Button,
  Snackbar,
  Alert,
  Box,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import InfoIcon from "@mui/icons-material/Info";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

import SearchFilter from "../components/content/SearchFilter";
import ContentCard from "../components/content/ContentCard";
import contentService from "../services/contentService";

import { useAuth } from "../auth/useAuth";

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

const iconMapping = {
  info: <InfoIcon fontSize="small" />,
  warning: <WarningAmberIcon fontSize="small" />,
  success: <CheckCircleOutlineIcon fontSize="small" />,
};

const Home = () => {
  const { user, logout } = useAuth();
  const [popularLessons, setPopularLessons] = useState([]);
  const [loadingPopular, setLoadingPopular] = useState(true);
  const [errorPopular, setErrorPopular] = useState(null);
  const [activeSlide, setActiveSlide] = useState(0);

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "info",
    message: "",
  });

  // Refs to track snackbar status and current user id to avoid repeats
  const roleInfoShownRef = useRef(false);
  const welcomeShownForUserRef = useRef(null);

  const navigate = useNavigate();

  // On user login change, show welcome message only once per user login
  useEffect(() => {
    if (user && welcomeShownForUserRef.current !== user.id) {
      // Show welcome snackbar once per login (user.id as unique id)
      setSnackbar({
        open: true,
        severity: "success",
        message: getWelcomeMessage(user.role),
      });
      welcomeShownForUserRef.current = user.id;
      roleInfoShownRef.current = false; // reset role info shown for this user
    }
  }, [user]);

  // Load popular lessons once
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
        setSnackbar({
          open: true,
          severity: "error",
          message: "Failed to load popular lessons.",
        });
        console.error(err);
      });
  }, []);

  const handleLogin = () => navigate("/login");
  const handleRegister = () => navigate("/register");
  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };
  const handleProfileRedirect = () => {
    if (user?.role === "ADMIN") {
      navigate("/admin");
    } else {
      navigate("/profile");
    }
  };

  function getWelcomeMessage(role) {
    switch (role) {
      case "ADMIN":
        return "Welcome, Admin!";
      case "CONTRIBUTOR":
        return "Welcome, Contributor!";
      case "LEARNER":
      default:
        return "Welcome, Learner!";
    }
  }

  const role = user?.role;

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 50, // a smooth fade speed (try 300)
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: true,
    pauseOnHover: true,
    fade: true,
    beforeChange: (current, next) => setActiveSlide(next),
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;

    setSnackbar((prev) => ({ ...prev, open: false }));

    // After welcome snackbar closes, show role info snackbar only once
    if (
      !roleInfoShownRef.current &&
      (role === "CONTRIBUTOR" || role === "ADMIN") &&
      snackbar.severity === "success" // This means welcome just closed
    ) {
      roleInfoShownRef.current = true;

      // Show role-specific info snackbar after welcome
      if (role === "CONTRIBUTOR") {
        setTimeout(() => {
          setSnackbar({
            open: true,
            severity: "info",
            message:
              "Welcome, contributor! Head to your profile to upload or edit your lessons.",
          });
        }, 300); // slight delay for smoothness
      } else if (role === "ADMIN") {
        setTimeout(() => {
          setSnackbar({
            open: true,
            severity: "warning",
            message:
              "You have admin privileges. Use the admin tools below to manage users and review content.",
          });
        }, 300);
      }
    }
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
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{ color: "#031227ff", fontWeight: "bold" }}
          >
            Welcome to GURU.Ik
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ color: "rgba(3, 18, 39, 0.7)", fontWeight: 500 }}
          >
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
                sx={{
                  textTransform: "capitalize",
                  fontWeight: "600",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: "0 6px 12px rgba(0,0,0,0.12)",
                  },
                }}
              >
                {role === "ADMIN" ? "Admin Dashboard" : "My Profile"}
              </Button>
              <Button
                startIcon={<LogoutIcon />}
                variant="outlined"
                color="error"
                onClick={handleLogout}
                size="large"
                sx={{
                  textTransform: "capitalize",
                  fontWeight: "600",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "error.main",
                    color: "white",
                    boxShadow: "0 6px 12px rgba(255,0,0,0.4)",
                  },
                }}
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
                sx={{
                  textTransform: "capitalize",
                  fontWeight: "600",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: "0 6px 12px rgba(25, 118, 210, 0.5)",
                  },
                }}
              >
                Login
              </Button>
              <Button
                startIcon={<AppRegistrationIcon />}
                variant="outlined"
                color="primary"
                onClick={handleRegister}
                size="large"
                sx={{
                  textTransform: "capitalize",
                  fontWeight: "600",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "primary.main",
                    color: "white",
                    boxShadow: "0 6px 12px rgba(25, 118, 210, 0.5)",
                  },
                }}
              >
                Register
              </Button>
            </>
          )}
        </Grid>
      </Grid>

      {/* Slider Section */}
      <Box sx={{ mb: 5 }}>
        <Slider {...sliderSettings}>
          {sliderImages.map(({ src, alt, caption }, idx) => (
            <Box key={idx} sx={{ position: "relative" }}>
              <img
                src={src}
                alt={alt}
                className={activeSlide === idx ? "zoom-in" : ""}
                style={{
                  width: "100%",
                  maxHeight: "400px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
              <Typography
                variant="h4"
                sx={{
                  position: "absolute",
                  bottom: "10%",
                  left: "5%",
                  color: "white",
                  fontWeight: "bold",
                  textShadow: "1px 1px 5px rgba(0,0,0,0.7)",
                  userSelect: "none",
                }}
              >
                {caption}
              </Typography>
            </Box>
          ))}
        </Slider>
      </Box>

      {/* Search Filter */}
      <Box sx={{ mb: 4 }}>
        <SearchFilter />
      </Box>

      {/* Popular Lessons */}
      <Typography
        variant="h5"
        sx={{ mb: 2, fontWeight: "600", color: "#031227ff" }}
      >
        Popular Lessons
      </Typography>

      {loadingPopular && (
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <CircularProgress color="primary" />
        </Box>
      )}

      {errorPopular && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorPopular}
        </Alert>
      )}

      {!loadingPopular && !errorPopular && popularLessons.length === 0 && (
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          No popular lessons available at the moment.
        </Typography>
      )}

      <Grid container spacing={3}>
        {popularLessons.map((lesson) => (
          <Grid item key={lesson.id} xs={12} sm={6} md={4}>
            <ContentCard lesson={lesson} />
          </Grid>
        ))}
      </Grid>

      {/* Snackbar Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        slotProps={{
          transition: {
            direction: "up",
          },
        }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%", fontWeight: "600", fontSize: "1rem" }}
          icon={iconMapping[snackbar.severity]}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Home;
