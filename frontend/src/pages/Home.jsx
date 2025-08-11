import React, { useEffect, useState, useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  Container,
  Grid,
  Typography,
  Button,
  Snackbar,
  Alert,
  Box,
  CircularProgress,
  Paper,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import InfoIcon from "@mui/icons-material/Info";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

import SearchFilter from "../components/content/SearchFilter";
import ContentCard from "../components/content/ContentCard";
import contentService from "../services/contentService";
import { useAuth } from "../auth/useAuth";

const sliderImages = [
  {
    src: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1350&q=80",
    alt: "Group study and collaboration",
    caption: "Collaborate and Learn Together",
    subcaption: "Join our community of learners and educators",
  },
  {
    src: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=1350&q=80",
    alt: "Open book and laptop for knowledge sharing",
    caption: "Share Your Knowledge",
    subcaption: "Contribute to our growing educational resources",
  },
  {
    src: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1350&q=80",
    alt: "Person writing notes and learning",
    caption: "Expand Your Skills",
    subcaption: "Discover lessons tailored to your learning needs",
  },
];

const iconMapping = {
  info: <InfoIcon fontSize="small" />,
  warning: <WarningAmberIcon fontSize="small" />,
  success: <CheckCircleOutlineIcon fontSize="small" />,
};

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { user, logout } = useAuth();
  const [popularLessons, setPopularLessons] = useState([]);
  const [filteredLessons, setFilteredLessons] = useState([]);
  const [loadingPopular, setLoadingPopular] = useState(true);
  const [errorPopular, setErrorPopular] = useState(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "info",
    message: "",
  });

  const roleInfoShownRef = useRef(false);
  const welcomeShownForUserRef = useRef(null);
  const sliderRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loadingPopular) {
      window.scrollTo(0, 0);
    }
  }, [loadingPopular]);
  useEffect(() => {
    const timeout = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100); // 100 ms delay

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (user && welcomeShownForUserRef.current !== user.id) {
      setSnackbar({
        open: true,
        severity: "success",
        message: getWelcomeMessage(user.role),
      });
      welcomeShownForUserRef.current = user.id;
      roleInfoShownRef.current = false;
    }
  }, [user]);

  useEffect(() => {
    setLoadingPopular(true);
    setErrorPopular(null);
    contentService
      .getPopularLessons()
      .then((data) => {
        setPopularLessons(data);
        setFilteredLessons(data); // Initialize filtered lessons with all popular lessons
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

  const handleFilter = ({ searchTerm, language, subject, ageGroup }) => {
    let filtered = [...popularLessons];

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

    // Show feedback if no results found
    if (filtered.length === 0) {
      setSnackbar({
        open: true,
        severity: "info",
        message: "No lessons match your search criteria.",
      });
    }
  };

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

  const CustomNextArrow = (props) => (
    <Box
      {...props}
      sx={{
        right: 25,
        zIndex: 1,
        "&:before": { display: "none" },
        "&:hover": { opacity: 0.8 },
      }}
    >
      <ArrowForwardIosIcon sx={{ color: "white", fontSize: 40 }} />
    </Box>
  );

  const CustomPrevArrow = (props) => (
    <Box
      {...props}
      sx={{
        left: 25,
        zIndex: 1,
        "&:before": { display: "none" },
        "&:hover": { opacity: 0.8 },
      }}
    >
      <ArrowBackIosIcon sx={{ color: "white", fontSize: 40 }} />
    </Box>
  );

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000,
    pauseOnHover: true,
    fade: true,
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
    beforeChange: (current, next) => setActiveSlide(next),
    appendDots: (dots) => (
      <Box
        sx={{
          position: "absolute",
          bottom: 20,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 1,
        }}
      >
        {dots}
      </Box>
    ),
    customPaging: (i) => (
      <Box
        sx={{
          width: 12,
          height: 12,
          borderRadius: "50%",
          bgcolor: activeSlide === i ? "primary.main" : "rgba(255,255,255,0.5)",
          transition: "all 0.3s ease",
          cursor: "pointer",
        }}
      />
    ),
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Container
      maxWidth="xl"
      sx={{
        mt: 4,
        mb: 6,
        fontFamily: "'Poppins', sans-serif",
        px: { xs: 2, sm: 3, md: 4 },
      }}
    >
      {/* Header */}
      <Grid
        container
        alignItems="center"
        spacing={3}
        sx={{ mb: 6 }}
        justifyContent="space-between"
      >
        <Grid item xs={12} md={8}>
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{
              color: "primary.dark",
              fontWeight: 700,
              fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
              lineHeight: 1.2,
              mb: 1,
            }}
          >
            Welcome to GURU.Ik
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: "text.secondary",
              fontWeight: 400,
              fontSize: { xs: "1rem", sm: "1.25rem" },
            }}
          >
            Sri Lanka's Premier Community Knowledge Sharing Platform
          </Typography>
        </Grid>

        <Grid
          item
          xs={12}
          md="auto"
          sx={{
            display: "flex",
            justifyContent: { xs: "flex-start", md: "flex-end" },
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
                size={isMobile ? "medium" : "large"}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: 2,
                  px: 3,
                  py: 1.5,
                  boxShadow: theme.shadows[3],
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: theme.shadows[6],
                  },
                }}
              >
                {role === "ADMIN" ? "Admin Dashboard" : "My Profile"}
              </Button>
              <Button
                startIcon={<LogoutIcon />}
                variant="contained"
                color="error"
                onClick={handleLogout}
                size={isMobile ? "medium" : "large"}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: 2,
                  px: 3,
                  py: 1.5,
                  boxShadow: theme.shadows[3],
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: theme.shadows[6],
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
                size={isMobile ? "medium" : "large"}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: 2,
                  px: 3,
                  py: 1.5,
                  boxShadow: theme.shadows[3],
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: theme.shadows[6],
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
                size={isMobile ? "medium" : "large"}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: 2,
                  px: 3,
                  py: 1.5,
                  borderWidth: 2,
                  "&:hover": {
                    borderWidth: 2,
                    transform: "translateY(-2px)",
                    boxShadow: theme.shadows[3],
                  },
                }}
              >
                Register
              </Button>
            </>
          )}
        </Grid>
      </Grid>

      {/* Hero Carousel */}
      <Paper
        elevation={6}
        sx={{
          mb: 8,
          borderRadius: 4,
          overflow: "hidden",
          position: "relative",
          "& .slick-slider": {
            height: "100%",
          },
          "& .slick-list, & .slick-track": {
            height: "100%",
          },
        }}
      >
        <Slider ref={sliderRef} {...sliderSettings}>
          {sliderImages.map(({ src, alt, caption, subcaption }, idx) => (
            <Box
              key={idx}
              sx={{
                position: "relative",
                height: { xs: "300px", sm: "400px", md: "500px" },
              }}
            >
              <Box
                component="img"
                src={src}
                alt={alt}
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  filter: "brightness(0.7)",
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  p: { xs: 3, sm: 4, md: 6 },
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 70%, transparent 100%)",
                  color: "white",
                }}
              >
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: "1.75rem", sm: "2.5rem", md: "3.5rem" },
                    mb: 1,
                    textShadow: "0 2px 10px rgba(0,0,0,0.5)",
                  }}
                >
                  {caption}
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 400,
                    fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" },
                    textShadow: "0 1px 5px rgba(0,0,0,0.5)",
                    maxWidth: "800px",
                  }}
                >
                  {subcaption}
                </Typography>
              </Box>
            </Box>
          ))}
        </Slider>
      </Paper>

      {/* Search Filter */}
      <Box sx={{ mb: 8 }}>
        <SearchFilter onFilter={handleFilter} />
      </Box>

      {/* Popular Lessons */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            mb: 4,
            fontWeight: 600,
            color: "primary.dark",
            position: "relative",
            display: "inline-block",
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: -8,
              left: 0,
              width: "100%",
              height: 4,
              background: "linear-gradient(90deg, #1976d2, #64b5f6)",
              borderRadius: 2,
            },
          }}
        >
          Popular Lessons
        </Typography>

        {loadingPopular && (
          <Box sx={{ display: "flex", justifyContent: "center", my: 8 }}>
            <CircularProgress size={60} thickness={4} color="primary" />
          </Box>
        )}

        {errorPopular && (
          <Alert
            severity="error"
            sx={{ mb: 4, borderRadius: 2, boxShadow: theme.shadows[1] }}
          >
            {errorPopular}
          </Alert>
        )}

        {!loadingPopular && !errorPopular && filteredLessons.length === 0 && (
          <Paper
            elevation={0}
            sx={{
              p: 4,
              textAlign: "center",
              bgcolor: "background.paper",
              borderRadius: 2,
              boxShadow: theme.shadows[1],
            }}
          >
            <Typography variant="h6" color="text.secondary">
              No lessons match your search criteria.
            </Typography>
          </Paper>
        )}

        <Grid container spacing={4}>
          {filteredLessons.map((lesson) => (
            <Grid item key={lesson.id} xs={12} sm={6} md={4} lg={3}>
              <ContentCard lesson={lesson} />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Snackbar Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        sx={{
          "& .MuiPaper-root": {
            borderRadius: 2,
            boxShadow: theme.shadows[6],
          },
        }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{
            width: "100%",
            fontWeight: 600,
            fontSize: "1rem",
            alignItems: "center",
          }}
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
