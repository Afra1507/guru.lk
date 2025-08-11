import React, { useState, useEffect, useContext } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Avatar,
  Chip,
  Tooltip,
  Divider,
  Grow,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import SchoolIcon from "@mui/icons-material/School";
import ForumIcon from "@mui/icons-material/Forum";
import NotificationsIcon from "@mui/icons-material/Notifications";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import { useNavigate } from "react-router-dom";
import LanguageSelector from "./LanguageSelector";
import { useAuth } from "../../auth/useAuth";
import Sidebar from "./Sidebar";
import { LanguageContext } from "../../context/LanguageContext";
import { translate } from "../../utils/language";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { language, changeLanguage } = useContext(LanguageContext);

  const [anchorEl, setAnchorEl] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuOpen = Boolean(anchorEl);

  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleSidebarToggle = () => setSidebarOpen((prev) => !prev);

  const handleDashboardRedirect = () => {
    if (!user) return;
    if (user.role === "ADMIN") navigate("/admin");
    else if (user.role === "CONTRIBUTOR") navigate("/contributor");
    else navigate("/learner");
    handleMenuClose();
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login"); // Redirect to logout page
    } catch (error) {
      console.error("Logout failed:", error);
    }
    handleMenuClose();
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { key: "home", icon: <HomeIcon />, path: "/" },
    { key: "lessons", icon: <SchoolIcon />, path: "/lessons" },
    { key: "forum", icon: <ForumIcon />, path: "/qna" },
  ];

  return (
    <>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <AppBar
        position="fixed"
        sx={{
          top: 10,
          left: "50%",
          transform: "translateX(-50%)",
          width: "95%",
          maxWidth: "1800px",
          borderRadius: "20px",
          padding: "6px 14px",
          background: scrolled
            ? "linear-gradient(135deg, rgba(0, 40, 85, 0.95), rgba(0, 40, 85, 0.85))"
            : "linear-gradient(135deg, rgba(0, 40, 85, 0.85), rgba(0, 40, 85, 0.75))",
          backdropFilter: scrolled ? "blur(25px) brightness(1.15)" : "blur(20px)",
          WebkitBackdropFilter: scrolled ? "blur(25px) brightness(1.15)" : "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          boxShadow: scrolled
            ? "0 8px 40px rgba(0,0,0,0.35)"
            : "0 4px 20px rgba(0,0,0,0.15)",
          fontFamily: "'Poppins', sans-serif",
          zIndex: 1200,
          transition: "all 0.3s ease-in-out",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            padding: { xs: "0 4px", sm: "0 8px", md: "0 12px" },
          }}
        >
          {/* Left section */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton
              edge="start"
              sx={{
                color: "#f8f9fa",
                transition: "all 0.3s ease",
                "&:hover": {
                  color: "#64b5f6",
                  transform: "scale(1.15)",
                  backgroundColor: "rgba(100, 181, 246, 0.1)",
                },
              }}
              onClick={handleSidebarToggle}
              aria-label="open drawer"
            >
              <MenuIcon />
            </IconButton>

            <Typography
              variant="h5"
              sx={{
                fontWeight: "700",
                cursor: "pointer",
                fontFamily: "'Poppins', sans-serif",
                letterSpacing: 1.5,
                userSelect: "none",
                color: "#f8f9fa",
                position: "relative",
                overflow: "hidden",
                transition: "color 0.3s ease",
                "&:hover": {
                  color: "#FFC107",
                  "&::after": { width: "100%" },
                },
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  height: "2px",
                  width: 0,
                  backgroundColor: "#FFC107",
                  transition: "width 0.3s ease",
                },
              }}
              onClick={() => navigate("/")}
              noWrap
            >
              GURU.Ik
            </Typography>
          </Box>

          {/* Center nav */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
            {navItems.map(({ key, icon, path }) => (
              <Tooltip key={key} title={translate(key, language)}>
                <Button
                  startIcon={icon}
                  onClick={() => navigate(path)}
                  sx={{
                    minWidth: "auto",
                    px: 2,
                    textTransform: "capitalize",
                    fontWeight: "600",
                    color: "#f8f9fa",
                    position: "relative",
                    overflow: "hidden",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      color: "#64b5f6",
                      backgroundColor: "rgba(100, 181, 246, 0.1)",
                      "&::after": { width: "100%" },
                    },
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      bottom: 0,
                      left: "50%",
                      transform: "translateX(-50%)",
                      height: "2px",
                      width: 0,
                      backgroundColor: "#64b5f6",
                      transition: "width 0.3s ease",
                    },
                  }}
                >
                  {translate(key, language)}
                </Button>
              </Tooltip>
            ))}
          </Box>

          {/* Right section */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <LanguageSelector
              selectedLanguage={language}
              onChange={changeLanguage}
            />

            {user ? (
              <>
                <Tooltip title={translate("account", language)}>
                  <Button
                    onClick={handleMenuClick}
                    sx={{
                      minWidth: "auto",
                      textTransform: "none",
                      fontWeight: 600,
                      letterSpacing: 0.5,
                      color: "#f8f9fa",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        color: "#FFC107",
                        backgroundColor: "rgba(255, 193, 7, 0.1)",
                      },
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        mr: 1,
                        bgcolor: "#FFC107",
                        color: "#002855",
                        fontWeight: "bold",
                        fontSize: "0.875rem",
                      }}
                    >
                      {user.username?.charAt(0).toUpperCase() || "U"}
                    </Avatar>
                    {user.username}
                  </Button>
                </Tooltip>
                
                <Menu
                  anchorEl={anchorEl}
                  open={menuOpen}
                  onClose={handleMenuClose}
                  TransitionComponent={Grow}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                  PaperProps={{
                    sx: {
                      mt: 1.5,
                      minWidth: 240,
                      bgcolor: "#002855",
                      color: "#f8f9fa",
                      borderRadius: "12px",
                      overflow: "hidden",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
                      "& .MuiMenuItem-root": {
                        fontWeight: 500,
                        fontSize: "0.9rem",
                        transition: "all 0.25s ease",
                        py: 1.5,
                        px: 2.5,
                      },
                      "& .MuiMenuItem-root:hover": {
                        bgcolor: "rgba(255,193,7,0.15)",
                        color: "#FFC107",
                        transform: "translateX(5px)",
                      },
                    },
                  }}
                >
                  <MenuItem disabled sx={{ opacity: 1 }}>
                    <Chip
                      label={user.role}
                      color={
                        user.role === "ADMIN"
                          ? "error"
                          : user.role === "CONTRIBUTOR"
                          ? "warning"
                          : "success"
                      }
                      size="small"
                      sx={{ fontWeight: "bold", textTransform: "uppercase" }}
                    />
                  </MenuItem>
                  <Divider sx={{ bgcolor: "rgba(255,255,255,0.1)", my: 0.5 }} />
                  <MenuItem onClick={handleDashboardRedirect}>
                    <DashboardIcon sx={{ mr: 1.5, fontSize: "1.1rem", color: "#FFC107" }} />
                    {user.role === "ADMIN"
                      ? translate("dashboardLabels.adminDashboard", language)
                      : user.role === "CONTRIBUTOR"
                      ? translate("dashboardLabels.contributorDashboard", language)
                      : translate("dashboardLabels.myDashboard", language)}
                  </MenuItem>
                  <MenuItem onClick={() => { navigate("/profile"); handleMenuClose(); }}>
                    <PersonIcon sx={{ mr: 1.5, fontSize: "1.1rem", color: "#FFC107" }} />
                    {translate("myProfile", language)}
                  </MenuItem>
                  <MenuItem onClick={() => { alert(translate("noNotifications", language)); handleMenuClose(); }}>
                    <NotificationsIcon sx={{ mr: 1.5, fontSize: "1.1rem", color: "#FFC107" }} />
                    {translate("notifications", language)}
                  </MenuItem>
                  <Divider sx={{ bgcolor: "rgba(255,255,255,0.1)", my: 0.5 }} />
                  <MenuItem 
                    onClick={handleLogout} 
                    sx={{ 
                      color: "#ff5252",
                      "&:hover": {
                        color: "#ff5252",
                        bgcolor: "rgba(255,82,82,0.1)",
                      }
                    }}
                  >
                    <LogoutIcon sx={{ mr: 1.5, fontSize: "1.1rem" }} />
                    {translate("logout", language)}
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Tooltip title={translate("login", language)}>
                  <Button
                    startIcon={<LoginIcon />}
                    onClick={() => navigate("/login")}
                    sx={{
                      minWidth: "auto",
                      px: 2,
                      textTransform: "capitalize",
                      fontWeight: "600",
                      color: "#f8f9fa",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        color: "#64b5f6",
                        backgroundColor: "rgba(100, 181, 246, 0.1)",
                      },
                    }}
                  >
                    {translate("login", language)}
                  </Button>
                </Tooltip>
                <Tooltip title={translate("register", language)}>
                  <Button
                    startIcon={<AppRegistrationIcon />}
                    onClick={() => navigate("/register")}
                    sx={{
                      minWidth: "auto",
                      px: 2,
                      textTransform: "capitalize",
                      fontWeight: "600",
                      color: "#f8f9fa",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        color: "#64b5f6",
                        backgroundColor: "rgba(100, 181, 246, 0.1)",
                      },
                    }}
                  >
                    {translate("register", language)}
                  </Button>
                </Tooltip>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Spacer */}
      <Toolbar />
    </>
  );
};

export default Header;