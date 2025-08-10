// src/components/QuestionCard.jsx
import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Stack,
} from "@mui/material";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PersonIcon from "@mui/icons-material/Person";
import { Link as RouterLink } from "react-router-dom";

const QuestionCard = ({ question }) => {
  return (
    <Card variant="outlined" sx={{ mb: 3, boxShadow: 3 }}>
      <CardContent>
        <Stack direction="row" alignItems="center" spacing={1} mb={1}>
          <QuestionAnswerIcon color="primary" />
          <Typography variant="h6" component="div" fontWeight="bold">
            {question.title}
          </Typography>
        </Stack>

        <Typography variant="body2" color="text.secondary" mb={2}>
          {question.body.length > 100
            ? question.body.slice(0, 100) + "..."
            : question.body}
        </Typography>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          color="text.secondary"
          fontSize="0.875rem"
          alignItems="center"
        >
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <PersonIcon fontSize="small" />
            <span>Asked by: {question.userId}</span>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={0.5}>
            <CalendarTodayIcon fontSize="small" />
            <span>{new Date(question.createdAt).toLocaleDateString()}</span>
          </Stack>
        </Stack>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          component={RouterLink}
          to={`/questions/${question.questionId}`}
          variant="contained"
          color="primary"
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};

export default QuestionCard;
