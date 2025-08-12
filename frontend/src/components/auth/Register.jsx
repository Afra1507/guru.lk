// auth/Register.jsx
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
  MenuItem,
  FormControlLabel,
  Checkbox,
  Snackbar,
  Divider,
  useTheme,
  Slide,
  Grow,
  Fade,
  Zoom,
  IconButton,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../services/authService";
import { FaUserPlus, FaSignInAlt } from "react-icons/fa";
import { MdOutlinePassword, MdEmail, MdLanguage, MdLocationOn } from "react-icons/md";
import { RiUser3Line, RiShieldUserLine } from "react-icons/ri";
import { IoMdOptions } from "react-icons/io";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Confetti from "react-confetti";
import { motion } from "framer-motion";

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
  const theme = useTheme();

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
      setSuccess(true);
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
      minHeight="100vh"
      sx={{
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        p: 2,
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: "-50%",
          right: "-50%",
          width: "80%",
          height: "80%",
          background: "radial-gradient(circle, rgba(25,118,210,0.1) 0%, rgba(255,255,255,0) 70%)",
          borderRadius: "50%",
          zIndex: 0,
        },
        "&::after": {
          content: '""',
          position: "absolute",
          bottom: "-60%",
          left: "-60%",
          width: "100%",
          height: "100%",
          background: "radial-gradient(circle, rgba(25,118,210,0.08) 0%, rgba(255,255,255,0) 70%)",
          borderRadius: "50%",
          zIndex: 0,
        },
      }}
    >
      {/* Confetti */}
      {success && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={500}
          gravity={0.2}
        />
      )}

      <Slide in direction="up" timeout={500}>
        <Card
          sx={{
            width: 500,
            boxShadow: "0 20px 50px rgba(0,0,0,0.1)",
            borderRadius: 4,
            border: "1px solid rgba(255,255,255,0.3)",
            backdropFilter: "blur(10px)",
            backgroundColor: "rgba(255,255,255,0.85)",
            position: "relative",
            zIndex: 1,
            overflow: "visible",
            "&:before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 8,
              background: "linear-gradient(90deg, #1976d2 0%, #4dabf5 100%)",
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
            },
          }}
        >
          <CardContent sx={{ p: 4 }}>
            {/* Logo and title */}
            <Box textAlign="center" mb={4}>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    mx: "auto",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #1976d2 0%, #4dabf5 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2,
                    boxShadow: "0 10px 20px rgba(25,118,210,0.2)",
                    transform: "translateY(-50%)",
                    border: "4px solid white",
                  }}
                >
                  <RiShieldUserLine size={36} color="white" />
                </Box>
              </motion.div>
              
              <Grow in timeout={800}>
                <Typography variant="h5" fontWeight="600" color="text.primary" gutterBottom>
                  Create Your Account
                </Typography>
              </Grow>
              
              <Fade in timeout={1000}>
                <Typography variant="body2" color="text.secondary">
                  Join our community to get started
                </Typography>
              </Fade>
            </Box>

            {/* Registration form */}
            <Box component="form" onSubmit={handleSubmit}>
              {/* Username */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <TextField
                  label="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  fullWidth
                  required
                  margin="normal"
                  variant="outlined"
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "& fieldset": {
                        borderColor: "rgba(0,0,0,0.1)",
                      },
                      "&:hover fieldset": {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <RiUser3Line color={theme.palette.primary.main} />
                      </InputAdornment>
                    ),
                  }}
                />
              </motion.div>

              {/* Email */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.15 }}
              >
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  fullWidth
                  required
                  margin="normal"
                  variant="outlined"
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "& fieldset": {
                        borderColor: "rgba(0,0,0,0.1)",
                      },
                      "&:hover fieldset": {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MdEmail color={theme.palette.primary.main} />
                      </InputAdornment>
                    ),
                  }}
                />
              </motion.div>

              {/* Password */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <TextField
                  label="Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  fullWidth
                  required
                  margin="normal"
                  variant="outlined"
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "& fieldset": {
                        borderColor: "rgba(0,0,0,0.1)",
                      },
                      "&:hover fieldset": {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MdOutlinePassword color={theme.palette.primary.main} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{
                            color: theme.palette.primary.main,
                            "&:hover": {
                              backgroundColor: "rgba(25,118,210,0.1)",
                            },
                          }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </motion.div>

              {/* Confirm Password */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.25 }}
              >
                <TextField
                  label="Confirm Password"
                  name="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  fullWidth
                  required
                  margin="normal"
                  variant="outlined"
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "& fieldset": {
                        borderColor: "rgba(0,0,0,0.1)",
                      },
                      "&:hover fieldset": {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MdOutlinePassword color={theme.palette.primary.main} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirm(!showConfirm)}
                          edge="end"
                          sx={{
                            color: theme.palette.primary.main,
                            "&:hover": {
                              backgroundColor: "rgba(25,118,210,0.1)",
                            },
                          }}
                        >
                          {showConfirm ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </motion.div>

              {/* Account Type */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <TextField
                  select
                  label="Account Type"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "& fieldset": {
                        borderColor: "rgba(0,0,0,0.1)",
                      },
                      "&:hover fieldset": {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <IoMdOptions color={theme.palette.primary.main} />
                      </InputAdornment>
                    ),
                  }}
                >
                  <MenuItem value="learner">Learner</MenuItem>
                  <MenuItem value="contributor">Contributor</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </TextField>
              </motion.div>

              {/* Preferred Language */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.35 }}
              >
                <TextField
                  select
                  label="Preferred Language"
                  name="preferredLanguage"
                  value={formData.preferredLanguage}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "& fieldset": {
                        borderColor: "rgba(0,0,0,0.1)",
                      },
                      "&:hover fieldset": {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MdLanguage color={theme.palette.primary.main} />
                      </InputAdornment>
                    ),
                  }}
                >
                  <MenuItem value="sinhala">Sinhala</MenuItem>
                  <MenuItem value="tamil">Tamil</MenuItem>
                  <MenuItem value="english">English</MenuItem>
                </TextField>
              </motion.div>

              {/* Region */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <TextField
                  label="Region"
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "& fieldset": {
                        borderColor: "rgba(0,0,0,0.1)",
                      },
                      "&:hover fieldset": {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MdLocationOn color={theme.palette.primary.main} />
                      </InputAdornment>
                    ),
                  }}
                />
              </motion.div>

              {/* Checkbox */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.45 }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.isLowIncome}
                      onChange={handleChange}
                      name="isLowIncome"
                      color="primary"
                      sx={{
                        "&.Mui-checked": {
                          color: theme.palette.primary.main,
                        },
                      }}
                    />
                  }
                  label="Limited internet connectivity"
                  sx={{ mt: 1, color: "text.secondary" }}
                />
              </motion.div>

              {/* Submit Button */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  fullWidth
                  sx={{
                    mt: 3,
                    py: 1.5,
                    borderRadius: 2,
                    fontSize: 16,
                    fontWeight: 600,
                    letterSpacing: 0.5,
                    boxShadow: "0 4px 14px rgba(25,118,210,0.3)",
                    "&:hover": {
                      boxShadow: "0 6px 20px rgba(25,118,210,0.4)",
                      transform: "translateY(-1px)",
                    },
                    transition: "all 0.3s ease",
                  }}
                  disabled={loading}
                  startIcon={!loading && <FaUserPlus />}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Register Now"
                  )}
                </Button>
              </motion.div>
            </Box>

            {/* Divider */}
            <Box sx={{ my: 3, position: "relative" }}>
              <Divider sx={{ borderColor: "rgba(0,0,0,0.1)" }} />
              <Typography
                variant="body2"
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  px: 2,
                  backgroundColor: "rgba(255,255,255,0.85)",
                  color: "text.secondary",
                }}
              >
                Already have an account?
              </Typography>
            </Box>

            {/* Login link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Typography variant="body2" textAlign="center">
                <Link
                  to="/login"
                  style={{
                    color: theme.palette.primary.main,
                    textDecoration: "none",
                    fontWeight: 600,
                    display: "inline-flex",
                    alignItems: "center",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  <FaSignInAlt style={{ marginRight: 4 }} />
                  Sign In
                </Link>
              </Typography>
            </motion.div>
          </CardContent>
        </Card>
      </Slide>

      {/* Snackbar Alert */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        TransitionComponent={Zoom}
      >
        <Alert
          severity="error"
          onClose={() => setSnackbarOpen(false)}
          sx={{
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            borderRadius: 2,
            borderLeft: "4px solid",
            borderColor: theme.palette.error.main,
          }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Register;