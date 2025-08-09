import React from "react";
import ContentUpload from "../content/ContentUpload";
import { Typography } from "@mui/material";

const ContributorNewUpload = () => {
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
        Upload New Content
      </Typography>
      <ContentUpload />
    </>
  );
};

export default ContributorNewUpload;
