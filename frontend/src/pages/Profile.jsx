import React, { useEffect, useState } from "react";
import ProfileInfo from "../components/profile/ProfileInfo";
import Sidebar from "../components/layout/Sidebar";
import {
  Container,
  Grid,
  Typography,
  Box,
  Paper,
  Divider,
  useTheme,
} from "@mui/material";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

const Profile = () => {
  const [user, setUser] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) {
    return (
      <Box p={8} textAlign="center">
        <Typography variant="h6" color="text.secondary">
          Loading...
        </Typography>
      </Box>
    );
  }

  const role = user.role?.toUpperCase();

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: 6,
        px: { xs: 3, sm: 6, md: 8 },
        bgcolor: "background.default",
        minHeight: "80vh",
      }}
    >
      <Grid
        container
        spacing={6}
        justifyContent="center"
        sx={{ maxWidth: 1300, mx: "auto" }}
      >
        {role !== "LEARNER" && (
          <Grid item xs={12} md={4} sx={{ position: "sticky", top: theme.spacing(10) }}>
            <Paper
              elevation={4}
              sx={{
                p: 3,
                borderRadius: 4,
                bgcolor: "background.paper",
                height: "fit-content",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  fontWeight: 600,
                  color: "primary.main",
                }}
              >
                <AccountCircleIcon fontSize="medium" />
                {role} Menu
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <Sidebar role={role} />
            </Paper>
          </Grid>
        )}
        <Grid item xs={12} md={role !== "LEARNER" ? 8 : 12}>
          <Paper
            elevation={6}
            sx={{
              p: { xs: 4, md: 6 },
              borderRadius: 5,
              bgcolor: "background.paper",
              boxShadow: theme.shadows[6],
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                mb: 3,
              }}
            >
              {role === "ADMIN" ? (
                <AdminPanelSettingsIcon
                  fontSize="large"
                  color="primary"
                  sx={{ mr: 1 }}
                />
              ) : (
                <AccountCircleIcon
                  fontSize="large"
                  color="primary"
                  sx={{ mr: 1 }}
                />
              )}
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                  color: "primary.main",
                  userSelect: "none",
                }}
              >
                {role === "ADMIN" ? "Admin Dashboard" : "User Profile"}
              </Typography>
            </Box>

            <Divider sx={{ mb: 4 }} />

            <ProfileInfo user={user} setUser={setUser} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;
