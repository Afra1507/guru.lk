import React, { useEffect, useState } from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Box,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Stack,
  Grid,
  styled,
} from "@mui/material";
import { useContent } from "../hooks/useContent";
import { useNavigate } from "react-router-dom";

// Icons
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import PersonIcon from "@mui/icons-material/Person";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import EventNoteIcon from "@mui/icons-material/EventNote";
import DescriptionIcon from "@mui/icons-material/Description";
import CloseIcon from "@mui/icons-material/Close";

// Color palette
const colors = {
  primary: "#1976d2",
  secondary: "#4fc3f7",
  accent: "#FFC107",
  darkBg: "#0a1929",
  lightText: "#f5f5f5",
  glassBorder: "rgba(255, 255, 255, 0.1)",
  success: "#388e3c",
  warning: "#ff9800",
};

// Styled components
const GlassPanel = styled(Paper)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  borderRadius: "16px",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
  padding: theme.spacing(4),
  width: "100%",
  maxWidth: "1200px",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "4px",
    background: `linear-gradient(90deg, ${colors.primary}, ${colors.accent})`,
    borderRadius: "16px 16px 0 0",
  },
}));


const SuccessButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(135deg, ${colors.success}, #66bb6a)`,
  color: "white",
  fontWeight: "bold",
  letterSpacing: "0.5px",
  borderRadius: "12px",
  padding: theme.spacing(1, 2.5),
  boxShadow: "0 4px 14px rgba(56, 142, 60, 0.3)",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: `0 6px 20px rgba(56, 142, 60, 0.4)`,
  },
}));

const StatusChip = styled(Box)(({ theme, approved }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: theme.spacing(0.5),
  padding: theme.spacing(0.5, 1.5),
  borderRadius: "20px",
  background: approved ? "rgba(56, 142, 60, 0.15)" : "rgba(255, 152, 0, 0.15)",
  color: approved ? colors.success : colors.warning,
  fontWeight: "600",
  fontSize: "0.8rem",
}));

const translate = (key, language) => {
  const translations = {
    confirmApprovalMessage: "Are you sure you want to approve '$title'?",
    thisLesson: "this lesson",
    cancel: "Cancel",
    approve: "Approve",
    noPendingLessons: "No pending lessons found",
    pendingLessonsTitle: "Pending Lesson Approvals",
    lessonTitle: "Lesson Title",
    uploadedBy: "Uploaded By",
    description: "Description",
    status: "Status",
    date: "Date",
    actions: "Actions",
    view: "Preview",
    previewTitle: "Lesson Preview",
    contentPreview: "Content Preview",
    lessonDetails: "Lesson Details",
    subject: "Subject",
    language: "Language",
    ageGroup: "Age Group",
    uploadDate: "Upload Date",
    approvalActions: "Approval Actions",
    closePreview: "Close Preview",
  };
  return translations[key] || key;
};

const PendingLessons = () => {
  const { getPendingLessons, approveLesson, loading, error } = useContent();
  const [pending, setPending] = useState([]);
  const [lessonToApprove, setLessonToApprove] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const navigate = useNavigate();
  const language = "en";

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const lessons = await getPendingLessons();
        setPending(lessons);
      } catch (e) {
        console.error("Failed to fetch pending lessons", e);
      }
    };

    fetchPending();
  }, [getPendingLessons]);

  const handleApproveClick = (lesson) => {
    setLessonToApprove(lesson);
    setConfirmOpen(true);
  };

  const handleConfirmClose = () => {
    setConfirmOpen(false);
    setLessonToApprove(null);
  };

  const handleConfirmApprove = async () => {
    if (!lessonToApprove) return;

    try {
      await approveLesson(lessonToApprove.lessonId);
      setPending((prev) =>
        prev.filter((lesson) => lesson.lessonId !== lessonToApprove.lessonId)
      );
      setConfirmOpen(false);
      setLessonToApprove(null);
    } catch (err) {
      console.error("Failed to approve lesson:", err);
      setConfirmOpen(false);
      setLessonToApprove(null);
    }
  };

  const confirmMessage = lessonToApprove
    ? translate("confirmApprovalMessage", language).replace(
        "$title",
        lessonToApprove.title || translate("thisLesson", language)
      )
    : "";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: 8,
        px: { xs: 2, sm: 4 },
      }}
    >
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <GlassPanel elevation={3}>
          {/* Header */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={4}
            flexWrap="wrap"
            gap={2}
          >
            <Box>
              <Typography
                variant="h3"
                component="h1"
                fontWeight="700"
                color="text.primary"
                sx={{
                  letterSpacing: "-0.5px",
                  mb: 0.5,
                }}
              >
                {translate("pendingLessonsTitle", language)}
              </Typography>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <EventNoteIcon fontSize="small" />
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Typography>
            </Box>

            <Box display="flex" gap={2}>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ display: "flex", alignItems: "center" }}
              >
                <HourglassEmptyIcon
                  color="warning"
                  sx={{ mr: 1, fontSize: "1.5rem" }}
                />
                {pending.length} Pending
              </Typography>
            </Box>
          </Box>

          {/* Content */}
          {loading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight="300px"
            >
              <CircularProgress size={60} thickness={4} />
            </Box>
          ) : error ? (
            <Box display="flex" justifyContent="center" my={4}>
              <Alert severity="error" sx={{ width: "100%", maxWidth: 600 }}>
                {error}
              </Alert>
            </Box>
          ) : pending.length === 0 ? (
            <Box
              textAlign="center"
              py={8}
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap={3}
            >
              <CheckCircleIcon
                sx={{
                  fontSize: 80,
                  color: colors.success,
                }}
              />
              <Typography
                variant="h5"
                fontWeight="600"
                color="text.primary"
                sx={{ maxWidth: "500px" }}
              >
                {translate("noPendingLessons", language)}
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ maxWidth: "500px", mb: 2 }}
              >
                All lessons have been reviewed and approved. Check back later for
                new submissions.
              </Typography>
            </Box>
          ) : (
            <TableContainer component={Box}>
              <Table sx={{ minWidth: 650 }} aria-label="pending lessons table">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "700", fontSize: "0.9rem" }}>
                      {translate("lessonTitle", language)}
                    </TableCell>
                    <TableCell sx={{ fontWeight: "700", fontSize: "0.9rem" }}>
                      {translate("uploadedBy", language)}
                    </TableCell>
                    <TableCell sx={{ fontWeight: "700", fontSize: "0.9rem" }}>
                      {translate("description", language)}
                    </TableCell>
                    <TableCell sx={{ fontWeight: "700", fontSize: "0.9rem" }}>
                      {translate("status", language)}
                    </TableCell>
                    <TableCell sx={{ fontWeight: "700", fontSize: "0.9rem" }}>
                      {translate("date", language)}
                    </TableCell>
                    <TableCell sx={{ fontWeight: "700", fontSize: "0.9rem" }}>
                      {translate("actions", language)}
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {pending.map((lesson) => (
                    <TableRow
                      key={lesson.lessonId}
                      hover
                      sx={{ "&:last-child td": { borderBottom: 0 } }}
                    >
                      <TableCell sx={{ fontWeight: "500" }}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <DescriptionIcon color="primary" fontSize="small" />
                          {lesson.title}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <PersonIcon color="action" fontSize="small" />
                          User #{lesson.uploaderId}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {lesson.description?.length > 100
                            ? lesson.description.slice(0, 100) + "..."
                            : lesson.description || "No description"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <StatusChip approved={false}>
                          <HourglassEmptyIcon fontSize="small" />
                          Pending
                        </StatusChip>
                      </TableCell>
                      <TableCell>
                        {new Date(lesson.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <SuccessButton
                            size="small"
                            startIcon={<CheckCircleIcon />}
                            onClick={() => handleApproveClick(lesson)}
                          >
                            {translate("approve", language)}
                          </SuccessButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </GlassPanel>
      </Box>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmOpen}
        onClose={handleConfirmClose}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "16px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "4px",
              background: colors.success,
            },
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: "600" }}>Confirm Approval</DialogTitle>
        <DialogContent>
          <DialogContentText>{confirmMessage}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleConfirmClose}
            color="inherit"
            sx={{ borderRadius: "8px", px: 3 }}
          >
            {translate("cancel", language)}
          </Button>
          <SuccessButton
            onClick={handleConfirmApprove}
            sx={{ px: 3 }}
            startIcon={<CheckCircleIcon />}
          >
            {translate("approve", language)}
          </SuccessButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PendingLessons;