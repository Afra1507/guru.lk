import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Stack,
  IconButton,
  Snackbar,
  Alert,
  Box,
} from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import { createVote, removeVote } from "../../services/communityService";
import { jwtDecode } from "jwt-decode";

const HAPPY_GIF = "https://media.giphy.com/media/111ebonMs90YLu/giphy.gif"; // smiling happy
const SAD_GIF = "https://media.giphy.com/media/d2lcHJTG5Tscg/giphy.gif"; // sad

const AnswerCard = ({ answer }) => {
  const [voteCount, setVoteCount] = useState(answer.voteDifference || 0);
  const [userVote, setUserVote] = useState(null); // "up", "down", or null
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
    gif: null,
  });

  useEffect(() => {
    const savedVote = localStorage.getItem(`vote_${answer.answerId}`);
    if (savedVote === "up" || savedVote === "down") {
      setUserVote(savedVote);
    }
  }, [answer.answerId]);

  const getUserInfo = () => {
    const token = localStorage.getItem("token");
    if (!token) return {};
    const decoded = jwtDecode(token);
    return {
      userId: decoded?.id || decoded?.userId || decoded?.sub,
      role: decoded?.role || "LEARNER",
    };
  };

  const handleVote = async (isUpvote) => {
    const { userId, role } = getUserInfo();
    if (!userId) {
      setSnackbar({
        open: true,
        message: "Please log in to vote.",
        severity: "warning",
        gif: null,
      });
      return;
    }

    if ((isUpvote && userVote === "up") || (!isUpvote && userVote === "down")) {
      try {
        const result = await removeVote(userId, role, answer.answerId);
        if (result.status >= 200 && result.status < 300) {
          setVoteCount((prev) => prev + (isUpvote ? -1 : 1));
          setUserVote(null);
          localStorage.removeItem(`vote_${answer.answerId}`);
          setSnackbar({
            open: true,
            message: "Vote removed",
            severity: "info",
            gif: null,
          });
        } else {
          throw new Error("Failed to remove vote");
        }
      } catch (err) {
        console.error(err);
        setSnackbar({
          open: true,
          message: "Failed to remove vote.",
          severity: "error",
          gif: null,
        });
      }
      return;
    }

    try {
      const result = await createVote(userId, role, {
        answerId: answer.answerId,
        isUpvote,
      });

      if (result.status >= 200 && result.status < 300 && result.data) {
        if (userVote === "up" && !isUpvote) setVoteCount((prev) => prev - 2);
        else if (userVote === "down" && isUpvote)
          setVoteCount((prev) => prev + 2);
        else setVoteCount((prev) => prev + (isUpvote ? 1 : -1));

        setUserVote(isUpvote ? "up" : "down");
        localStorage.setItem(
          `vote_${answer.answerId}`,
          isUpvote ? "up" : "down"
        );

        setSnackbar({
          open: true,
          message: isUpvote
            ? "Thanks for your upvote! 😊"
            : "Aren't you sorry? 😞",
          severity: isUpvote ? "success" : "error",
          gif: isUpvote ? HAPPY_GIF : SAD_GIF,
        });
      } else {
        throw new Error("Failed to vote");
      }
    } catch (err) {
      console.error(err);
      // Check if error is UnauthorizedException for voting own answer
      const errMsg =
        err?.response?.data?.message || err.message || "Failed to vote.";

      if (errMsg.includes("Cannot vote on your own answer")) {
        setSnackbar({
          open: true,
          message: "You cannot vote on your own answer.",
          severity: "warning",
          gif: null,
        });
      } else if (errMsg.includes("Admins cannot vote on answers")) {
        setSnackbar({
          open: true,
          message: "Admins are not allowed to vote.",
          severity: "warning",
          gif: null,
        });
      } else {
        setSnackbar({
          open: true,
          message: "Failed to vote.",
          severity: "error",
          gif: null,
        });
      }
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="body1" gutterBottom>
            {answer.body}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Answered by: {answer.userId} on{" "}
            {new Date(answer.createdAt).toLocaleDateString()}
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center" mt={1}>
            <IconButton
              color={userVote === "up" ? "success" : "default"}
              onClick={() => handleVote(true)}
              aria-label="upvote"
              size="medium"
            >
              <ThumbUpIcon />
            </IconButton>
            <IconButton
              color={userVote === "down" ? "error" : "default"}
              onClick={() => handleVote(false)}
              aria-label="downvote"
              size="medium"
            >
              <ThumbDownIcon />
            </IconButton>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ minWidth: 60, userSelect: "none" }}
            >
              {voteCount} votes
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "center", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{
            width: 320,
            display: "flex",
            alignItems: "center",
            gap: 2,
            fontWeight: "bold",
            fontSize: "small",
            p: 2,
            justifyContent: "flex-end",
            textAlign: "right",
          }}
          icon={false}
        >
          {snackbar.gif && (
            <Box
              component="img"
              src={snackbar.gif}
              alt="emoji"
              sx={{ width: 50, height: 50, borderRadius: "50%", mr: 1 }}
            />
          )}
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AnswerCard;
