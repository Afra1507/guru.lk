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

  // Optional: Close menu when user logs out externally
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
        color="primary"
        sx={{ boxShadow: 3, fontFamily: "'Poppins', sans-serif" }}
      >
        <Toolbar>
          {/* Sidebar toggle */}
          <IconButton
            edge="start"
            color="inherit"
            sx={{ mr: 2 }}
            onClick={handleSidebarToggle}
            aria-label="open drawer"
          >
            <MenuIcon />
          </IconButton>

          {/* Brand Title with custom font */}
          <Typography
            variant="h5"
            sx={{
              flexGrow: 1,
              fontWeight: "700",
              cursor: "pointer",
              fontFamily: "'Poppins', sans-serif",
              letterSpacing: 2,
              userSelect: "none",
              color: "white",
              "&:hover": { color: "secondary.light" },
            }}
            onClick={() => navigate("/")}
            noWrap
          >
            GURU.Ik
          </Typography>

          {/* Navigation Buttons */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1, mr: 2 }}>
            <Button
              color="inherit"
              startIcon={<HomeIcon />}
              onClick={() => navigate("/")}
              sx={{ textTransform: "capitalize", fontWeight: "600" }}
            >
              Home
            </Button>
            <Button
              color="inherit"
              startIcon={<SchoolIcon />}
              onClick={() => navigate("/lessons")}
              sx={{ textTransform: "capitalize", fontWeight: "600" }}
            >
              Lessons
            </Button>
            <Button
              color="inherit"
              startIcon={<ForumIcon />}
              onClick={() => navigate("/qna")}
              sx={{ textTransform: "capitalize", fontWeight: "600" }}
            >
              Q&A Forum
            </Button>
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
                      bgcolor: "#fff",
                      color: "primary.main",
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
                    "& .MuiMenuItem-root": { fontWeight: 600 },
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
                <Divider />
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
                <Divider />
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
                  sx={{ textTransform: "capitalize", fontWeight: "600", ml: 2 }}
                >
                  Login
                </Button>
              </Tooltip>
              <Tooltip title="Register">
                <Button
                  color="inherit"
                  startIcon={<AppRegistrationIcon />}
                  onClick={() => navigate("/register")}
                  sx={{ textTransform: "capitalize", fontWeight: "600" }}
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
