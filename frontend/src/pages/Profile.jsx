import React, { useEffect, useState } from "react";
import ProfileInfo from "../components/profile/ProfileInfo";
import Sidebar from "../components/layout/Sidebar";
import { Container, Grid, Typography, Box } from "@mui/material";

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) {
    return (
      <Box p={4} textAlign="center">
        <Typography variant="h6" color="text.secondary">
          Loading...
        </Typography>
      </Box>
    );
  }

  const role = user.role?.toUpperCase();

  return (
    <Container
      maxWidth={false}
      sx={{ py: 5, px: { xs: 2, sm: 3, md: 4 }, bgcolor: "background.default" }}
    >
      <Grid
        container
        spacing={4}
        justifyContent="center"
        sx={{ maxWidth: 1200, mx: "auto" }}
      >
        {role !== "LEARNER" && (
          <Grid item xs={12} md={4}>
            <Sidebar role={role} />
          </Grid>
        )}
        <Grid item xs={12} md={role !== "LEARNER" ? 8 : 12}>
          <Box p={{ xs: 2, md: 3 }} boxShadow={2} borderRadius={3} bgcolor="background.paper">
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 700,
                fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
                letterSpacing: "0.05em",
                color: "primary.main",
              }}
            >
              {role === "ADMIN" ? "Admin Dashboard" : "User Profile"}
            </Typography>
            <ProfileInfo user={user} setUser={setUser} />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;
