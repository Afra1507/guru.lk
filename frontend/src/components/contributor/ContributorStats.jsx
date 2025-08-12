import React from "react";
import UploadStats from "./UploadStats";
import { Typography } from "@mui/material";

const ContributorStats = () => {
  return (
    <>
      <Typography
        variant="h4"
        component="h2"
        align="center"
        gutterBottom
        sx={{
          mb: 4,
          fontWeight: 700,
          fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
          letterSpacing: "0.05em",
          color: "#2c3e50",
        }}
      >
      </Typography>
      <UploadStats />
    </>
  );
};

export default ContributorStats;
