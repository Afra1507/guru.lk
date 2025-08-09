import React from "react";
import { Box, Container, Typography } from "@mui/material";
import UserManagement from "../components/admin/UserManagement";

const AdminDashboard = () => {
  return (
    <Box
      className="admin-dashboard"
      sx={{
        bgcolor: "#f9f9f9",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center", // centers horizontally
        py: 4,
      }}
    >
      <Container maxWidth="md" sx={{ textAlign: "center" }}>
        <Typography
          variant="h3"
          gutterBottom
          sx={{
            fontWeight: 700,
            fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
            letterSpacing: "0.05em",
            color: "#001f54", // navy blue
          }}
        >
          Admin Dashboard
        </Typography>
        <UserManagement />
      </Container>
    </Box>
  );
};

export default AdminDashboard;
