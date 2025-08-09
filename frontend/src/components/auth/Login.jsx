// auth/Login.jsx
import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Fade,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authService";
import { useAuth } from "../../auth/AuthContext";
import { FaSignInAlt } from "react-icons/fa";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { translate } from "../../utils/language";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  // Get current language from localStorage (or change to your context/state)
  const language = localStorage.getItem("language") || "sinhala";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { token } = await loginUser(formData);
      await login(token);

      // You can handle roles here if needed
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || translate("loginPage.loginFailed", language) || "Login failed.");
    }

    setLoading(false);
  };

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="90vh"
      sx={{
        fontFamily: "Roboto, sans-serif",
        background: "linear-gradient(to right, #ece9e6, #ffffff)",
        p: 2,
      }}
    >
      <Card sx={{ width: 400, boxShadow: 5, borderRadius: 3 }}>
        <CardContent>
          {/* Logo and title */}
          <Box textAlign="center" mb={3}>
            <Box
              sx={{
                width: 80,
                height: 80,
                mx: "auto",
                borderRadius: "50%",
                backgroundColor: "#1976d2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 1,
              }}
            >
              <FaSignInAlt size={32} color="white" />
            </Box>
            <Typography variant="h5" fontWeight="bold">
              {translate("loginPage.welcomeBack", language)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {translate("loginPage.pleaseLogin", language)}
            </Typography>
          </Box>

          {/* Error alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Login form */}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label={translate("loginPage.username", language)}
              name="username"
              value={formData.username}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label={translate("loginPage.password", language)}
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword}
                      edge="end"
                      aria-label={translate("loginPage.togglePasswordVisibility", language)}
                    >
                      <Fade in={!showPassword} timeout={200} unmountOnExit>
                        <VisibilityOff color="action" />
                      </Fade>
                      <Fade in={showPassword} timeout={200} unmountOnExit>
                        <Visibility color="action" />
                      </Fade>
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              sx={{ mt: 3, py: 1.3, borderRadius: 2 }}
              disabled={loading}
              startIcon={!loading && <FaSignInAlt />}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                translate("loginPage.loginButton", language)
              )}
            </Button>
          </Box>

          {/* Register link */}
          <Typography variant="body2" textAlign="center" sx={{ mt: 3 }}>
            {translate("loginPage.dontHaveAccount", language)}{" "}
            <Link
              to="/register"
              style={{ color: "#1976d2", textDecoration: "none" }}
            >
              {translate("loginPage.registerHere", language)}
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
