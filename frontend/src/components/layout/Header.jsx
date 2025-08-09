import React, { useState, useEffect } from "react";
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

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const menuOpen = Boolean(anchorEl);

  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleSidebarToggle = () => setSidebarOpen((prev) => !prev);

  const handleDashboardRedirect = () => {
    if (!user) return;
    if (user.role === "ADMIN") navigate("/admin");
    else if (user.role === "CONTRIBUTOR") navigate("/contributor/uploads");
    else navigate("/learner");
    handleMenuClose();
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate("/login");
  };

  useEffect(() => {
    if (!user) {
      setAnchorEl(null);
    }
  }, [user]);

  return (
    <>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <AppBar
        position="static"
        color="transparent"
        sx={{
          bgcolor: "#031227ff",
          boxShadow: 3,
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        <Toolbar>
          {/* Sidebar toggle */}
          <IconButton
            edge="start"
            sx={{
              mr: 2,
              color: "#e0e6f2",
              transition: "color 0.3s ease",
              "&:hover": { color: "#a3bffa", transform: "scale(1.1)" },
            }}
            onClick={handleSidebarToggle}
            aria-label="open drawer"
          >
            <MenuIcon />
          </IconButton>

          {/* Brand Title with hover effect */}
          <Typography
            variant="h5"
            sx={{
              flexGrow: 1,
              fontWeight: "700",
              cursor: "pointer",
              fontFamily: "'Poppins', sans-serif",
              letterSpacing: 2,
              userSelect: "none",
              color: "#e0e6f2",
              position: "relative",
              overflow: "hidden",
              transition: "color 0.3s ease",
              "&:hover": {
                color: "#a3bffa",
                "&::after": {
                  width: "100%",
                },
              },
              "&::after": {
                content: '""',
                position: "absolute",
                bottom: 0,
                left: 0,
                height: "3px",
                width: 0,
                backgroundColor: "#a3bffa",
                transition: "width 0.3s ease",
              },
            }}
            onClick={() => navigate("/")}
            noWrap
          >
            GURU.Ik
          </Typography>

          {/* Navigation Buttons with underline animation */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2, mr: 2 }}>
            {["Home", "Lessons", "Q&A Forum"].map((label, index) => {
              const icons = [<HomeIcon />, <SchoolIcon />, <ForumIcon />];
              const paths = ["/", "/lessons", "/qna"];
              return (
                <Button
                  key={label}
                  color="inherit"
                  startIcon={icons[index]}
                  onClick={() => navigate(paths[index])}
                  sx={{
                    textTransform: "capitalize",
                    fontWeight: "600",
                    color: "#e0e6f2",
                    position: "relative",
                    overflow: "hidden",
                    transition: "color 0.3s ease",
                    "&:hover": {
                      color: "#a3bffa",
                      "&::after": {
                        width: "100%",
                      },
                    },
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      height: "2px",
                      width: 0,
                      backgroundColor: "#a3bffa",
                      transition: "width 0.3s ease",
                    },
                  }}
                >
                  {label}
                </Button>
              );
            })}
          </Box>

          <LanguageSelector />

          {/* User Account Section */}
          {user ? (
            <>
              <Button
                color="inherit"
                onClick={handleMenuClick}
                startIcon={
                  <Avatar
                    sx={{
                      bgcolor: "#e0e6f2",
                      color: "#031227",
                      fontWeight: "bold",
                      textTransform: "uppercase",
                    }}
                  >
                    {user.username?.charAt(0) || "U"}
                  </Avatar>
                }
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  letterSpacing: 0.5,
                  ml: 2,
                  color: "#e0e6f2",
                  transition: "color 0.3s ease, transform 0.3s ease",
                  "&:hover": {
                    color: "#a3bffa",
                    transform: "scale(1.05)",
                  },
                }}
                aria-controls={menuOpen ? "account-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={menuOpen ? "true" : undefined}
              >
                Account
              </Button>
              <Menu
                id="account-menu"
                anchorEl={anchorEl}
                open={menuOpen}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                PaperProps={{
                  sx: {
                    mt: 1,
                    minWidth: 220,
                    bgcolor: "#031227",
                    color: "#e0e6f2",
                    "& .MuiMenuItem-root": { fontWeight: 600 },
                    "& .MuiMenuItem-root:hover": {
                      bgcolor: "#1a3a70",
                      color: "#a3bffa",
                    },
                  },
                }}
              >
                <MenuItem disabled>
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
                    sx={{ fontWeight: "bold" }}
                  />
                </MenuItem>
                <Divider sx={{ bgcolor: "#1a3a70" }} />
                <MenuItem onClick={handleDashboardRedirect} disableRipple>
                  <DashboardIcon sx={{ mr: 1, color: "primary.main" }} />
                  {user.role === "ADMIN"
                    ? "Admin Dashboard"
                    : user.role === "CONTRIBUTOR"
                    ? "Contributor Dashboard"
                    : "My Dashboard"}
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    navigate("/profile");
                    handleMenuClose();
                  }}
                  disableRipple
                >
                  <PersonIcon sx={{ mr: 1, color: "primary.main" }} />
                  My Profile
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    alert("No new notifications");
                    handleMenuClose();
                  }}
                  disableRipple
                >
                  <NotificationsIcon sx={{ mr: 1, color: "primary.main" }} />
                  Notifications
                </MenuItem>
                <Divider sx={{ bgcolor: "#1a3a70" }} />
                <MenuItem
                  onClick={handleLogout}
                  disableRipple
                  sx={{ color: "error.main" }}
                >
                  <LogoutIcon sx={{ mr: 1 }} />
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Tooltip title="Login">
                <Button
                  color="inherit"
                  startIcon={<LoginIcon />}
                  onClick={() => navigate("/login")}
                  sx={{
                    textTransform: "capitalize",
                    fontWeight: "600",
                    ml: 2,
                    color: "#e0e6f2",
                    transition: "color 0.3s ease, transform 0.3s ease",
                    "&:hover": {
                      color: "#a3bffa",
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  Login
                </Button>
              </Tooltip>
              <Tooltip title="Register">
                <Button
                  color="inherit"
                  startIcon={<AppRegistrationIcon />}
                  onClick={() => navigate("/register")}
                  sx={{
                    textTransform: "capitalize",
                    fontWeight: "600",
                    color: "#e0e6f2",
                    transition: "color 0.3s ease, transform 0.3s ease",
                    "&:hover": {
                      color: "#a3bffa",
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  Register
                </Button>
              </Tooltip>
            </>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Header;
