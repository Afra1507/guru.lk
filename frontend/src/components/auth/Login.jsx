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
  Slide,
  Grow,
  Zoom,
  Divider,
  useTheme,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authService";
import { useAuth } from "../../auth/AuthContext";
import { FaSignInAlt, FaUserPlus } from "react-icons/fa";
import { MdOutlinePassword, MdEmail } from "react-icons/md";
import { RiShieldUserLine } from "react-icons/ri";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { translate } from "../../utils/language";
import { motion } from "framer-motion";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const theme = useTheme();

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
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          translate("loginPage.loginFailed", language) ||
          "Login failed."
      );
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
          background:
            "radial-gradient(circle, rgba(25,118,210,0.1) 0%, rgba(255,255,255,0) 70%)",
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
          background:
            "radial-gradient(circle, rgba(25,118,210,0.08) 0%, rgba(255,255,255,0) 70%)",
          borderRadius: "50%",
          zIndex: 0,
        },
      }}
    >
      <Slide in direction="up" timeout={500}>
        <Card
          sx={{
            width: 450,
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
                    background:
                      "linear-gradient(135deg, #1976d2 0%, #4dabf5 100%)",
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
                <Typography
                  variant="h5"
                  fontWeight="600"
                  color="text.primary"
                  gutterBottom
                >
                  {translate("loginPage.welcomeBack", language)}
                </Typography>
              </Grow>

              <Fade in timeout={1000}>
                <Typography variant="body2" color="text.secondary">
                  {translate("loginPage.pleaseLogin", language)}
                </Typography>
              </Fade>
            </Box>

            {/* Error alert */}
            {error && (
              <Zoom in>
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                  {error}
                </Alert>
              </Zoom>
            )}

            {/* Login form */}
            <Box component="form" onSubmit={handleSubmit}>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <TextField
                  label={translate("loginPage.username", language)}
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
                        <MdEmail color={theme.palette.primary.main} />
                      </InputAdornment>
                    ),
                  }}
                />
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <TextField
                  label={translate("loginPage.password", language)}
                  type={showPassword ? "text" : "password"}
                  name="password"
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
                          onClick={handleClickShowPassword}
                          edge="end"
                          aria-label={translate(
                            "loginPage.togglePasswordVisibility",
                            language
                          )}
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

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  fullWidth
                  sx={{
                    mt: 2,
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
                  startIcon={!loading && <FaSignInAlt />}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    translate("loginPage.loginButton", language)
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
              ></Typography>
            </Box>

            {/* Register link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Typography variant="body2" textAlign="center" sx={{ mt: 1 }}>
                {translate("loginPage.dontHaveAccount", language)}{" "}
                <Link
                  to="/register"
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
                  <FaUserPlus style={{ marginRight: 4 }} />
                  {translate("loginPage.registerHere", language)}
                </Link>
              </Typography>
            </motion.div>
          </CardContent>
        </Card>
      </Slide>
    </Box>
  );
};

export default Login;
