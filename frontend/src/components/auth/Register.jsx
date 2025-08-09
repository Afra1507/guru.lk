// auth/Register.jsx
import React, { useState, useEffect } from "react";
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
  MenuItem,
  FormControlLabel,
  Checkbox,
  Snackbar,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../services/authService";
import { FaUserPlus } from "react-icons/fa";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import PublicIcon from "@mui/icons-material/Public";
import Confetti from "react-confetti";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "learner",
    preferredLanguage: "sinhala",
    region: "",
    isLowIncome: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setSnackbarOpen(true);
      return;
    }

    setError("");
    setLoading(true);

    try {
      await registerUser(formData);
      setSuccess(true); // Show confetti
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
      setSnackbarOpen(true);
    }

    setLoading(false);
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
        position: "relative",
      }}
    >
      {/* Fireworks / Confetti */}
      {success && <Confetti width={window.innerWidth} height={window.innerHeight} />}

      <Card sx={{ width: 500, boxShadow: 5, borderRadius: 3 }}>
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
              <FaUserPlus size={32} color="white" />
            </Box>
            <Typography variant="h5" fontWeight="bold">
              Create an Account
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Fill in your details to register
            </Typography>
          </Box>

          {/* Registration form */}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Username"
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
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
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
                  <InputAdornment
                    position="end"
                    onClick={() => setShowPassword(!showPassword)}
                    sx={{ cursor: "pointer" }}
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Confirm Password"
              name="confirmPassword"
              type={showConfirm ? "text" : "password"}
              value={formData.confirmPassword}
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
                  <InputAdornment
                    position="end"
                    onClick={() => setShowConfirm(!showConfirm)}
                    sx={{ cursor: "pointer" }}
                  >
                    {showConfirm ? <Visibility /> : <VisibilityOff />}
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              select
              label="Account Type"
              name="role"
              value={formData.role}
              onChange={handleChange}
              fullWidth
              margin="normal"
            >
              <MenuItem value="learner">Learner</MenuItem>
              <MenuItem value="contributor">Contributor</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </TextField>

            <TextField
              select
              label="Preferred Language"
              name="preferredLanguage"
              value={formData.preferredLanguage}
              onChange={handleChange}
              fullWidth
              margin="normal"
            >
              <MenuItem value="sinhala">Sinhala</MenuItem>
              <MenuItem value="tamil">Tamil</MenuItem>
              <MenuItem value="english">English</MenuItem>
            </TextField>

            <TextField
              label="Region"
              name="region"
              value={formData.region}
              onChange={handleChange}
              fullWidth
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PublicIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.isLowIncome}
                  onChange={handleChange}
                  name="isLowIncome"
                  color="primary"
                />
              }
              label="Limited internet connectivity"
              sx={{ mt: 1 }}
            />

            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              sx={{ mt: 3, py: 1.3, borderRadius: 2 }}
              disabled={loading}
              startIcon={!loading && <FaUserPlus />}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Register"
              )}
            </Button>
          </Box>

          {/* Login link */}
          <Typography variant="body2" textAlign="center" sx={{ mt: 3 }}>
            Already have an account?{" "}
            <Link
              to="/login"
              style={{ color: "#1976d2", textDecoration: "none" }}
            >
              Login
            </Link>
          </Typography>
        </CardContent>
      </Card>

      {/* Snackbar Alert */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="error" onClose={() => setSnackbarOpen(false)}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Register;
