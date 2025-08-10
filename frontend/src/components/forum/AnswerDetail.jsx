// src/components/AnswerDetail.jsx
import React from "react";
import { Card, Typography, Box } from "@mui/material";

const AnswerDetail = ({ answer }) => {
  return (
    <Card sx={{ p: 2, mb: 2, bgcolor: "background.paper" }} elevation={2}>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        Answer by {answer.userId}
      </Typography>
      <Typography variant="body1" sx={{ mb: 1 }}>
        {answer.body}
      </Typography>
      <Typography variant="caption" color="text.disabled">
        Created: {new Date(answer.createdAt).toLocaleString()}
      </Typography>
    </Card>
  );
};

export default AnswerDetail;
