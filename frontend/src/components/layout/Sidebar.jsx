import React, { useEffect, useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  ExpandLess,
  ExpandMore,
  Home,
  Book,
  Person,
  CloudUpload,
  CheckCircle,
  BarChart,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useContent } from "../../hooks/useContent";
import { useAuth } from "../../auth/useAuth";
import { useNavigate } from "react-router-dom";
import { translate, initLanguage } from "../../utils/language";

const PendingApprovalsDialog = ({
  open,
  onClose,
  pendingLessons,
  onApproveClick,
  loadingApprove,
  language,
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ position: "relative" }}>
        {translate("pendingLessonApprovals", language)}
        <IconButton
          aria-label={translate("close", language)}
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {pendingLessons.length === 0 ? (
          <Typography>{translate("noPendingLessons", language)}</Typography>
        ) : (
          pendingLessons.map((lesson) => (
            <ListItem
              key={lesson.lessonId || lesson.id}
              secondaryAction={
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() =>
                    onApproveClick(lesson.lessonId || lesson.id, lesson.title)
                  }
                  disabled={loadingApprove}
                  sx={{
                    transition: "transform 0.3s ease",
                    "&:hover": {
                      transform: loadingApprove ? "none" : "scale(1.05)",
                    },
                  }}
                >
                  {loadingApprove ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    translate("approve", language)
                  )}
                </Button>
              }
              disableGutters
              sx={{
                mb: 1,
                px: 2,
                borderRadius: 1,
                bgcolor: "background.paper",
                boxShadow: 1,
                transition: "background-color 0.3s ease",
                "&:hover": {
                  bgcolor: "primary.light",
                },
              }}
            >
              <ListItemText
                primary={
                  lesson.title ||
                  `${translate("lessonId", language)}: ${
                    lesson.lessonId || lesson.id
                  }`
                }
                secondary={`${translate("uploadedBy", language)}: ${
                  lesson.uploaderName ||
                  lesson.uploaderId ||
                  translate("unknown", language)
                }`}
              />
            </ListItem>
          ))
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>{translate("close", language)}</Button>
      </DialogActions>
    </Dialog>
  );
};

const ConfirmDialog = ({ open, onClose, onConfirm, message, language }) => {
  return (
    <Dialog open={open} onClose={() => onClose(false)} maxWidth="xs" fullWidth>
      <DialogTitle>{translate("confirmApproval", language)}</DialogTitle>
      <DialogContent>
        <Typography>{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(false)}>{translate("cancel", language)}</Button>
        <Button variant="contained" onClick={() => onConfirm()} color="primary">
          {translate("yes", language)}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const Sidebar = ({ open, onClose }) => {
  const [role, setRole] = useState("learner");
  const [expandedSections, setExpandedSections] = useState({ content: true });
  const [pendingApprovalsCount, setPendingApprovalsCount] = useState(0);
  const [pendingLessons, setPendingLessons] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loadingApprove, setLoadingApprove] = useState(false);
  const [loadingPending, setLoadingPending] = useState(false);

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [lessonToApprove, setLessonToApprove] = useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // Language state
  const [language, setLanguage] = useState(initLanguage());

  const { user } = useAuth();
  const { getPendingLessons, approveLesson } = useContent();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role?.toLowerCase() === "admin") {
      setRole("admin");
      fetchPendingLessonsCount();
    } else if (user?.role?.toLowerCase() === "contributor") {
      setRole("contributor");
    } else {
      setRole("learner");
    }
  }, [user]);

  const fetchPendingLessonsCount = async () => {
    setLoadingPending(true);
    try {
      const pending = await getPendingLessons();
      setPendingApprovalsCount(Array.isArray(pending) ? pending.length : 0);
    } catch (err) {
      setPendingApprovalsCount(0);
    } finally {
      setLoadingPending(false);
    }
  };

  const fetchPendingLessons = async () => {
    setLoadingPending(true);
    try {
      const lessons = await getPendingLessons();
      setPendingLessons(Array.isArray(lessons) ? lessons : []);
      setDialogOpen(true);
    } catch (err) {
      setPendingLessons([]);
      setDialogOpen(true);
    } finally {
      setLoadingPending(false);
    }
  };

  const handleApproveClick = (lessonId, lessonTitle) => {
    setLessonToApprove({ id: lessonId, title: lessonTitle });
    setConfirmDialogOpen(true);
  };

  const handleConfirmApprove = async () => {
    if (!lessonToApprove) return;
    setLoadingApprove(true);
    setConfirmDialogOpen(false);
    try {
      await approveLesson(lessonToApprove.id);
      setPendingLessons((prev) =>
        prev.filter(
          (lesson) => (lesson.lessonId || lesson.id) !== lessonToApprove.id
        )
      );
      setPendingApprovalsCount((count) => Math.max(count - 1, 0));
      setSnackbar({
        open: true,
        message: translate("lessonApprovedSuccess", language),
        severity: "success",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: translate("lessonApprovedFail", language),
        severity: "error",
      });
    } finally {
      setLoadingApprove(false);
      setLessonToApprove(null);
    }
  };

  const handleConfirmClose = (confirmed) => {
    setConfirmDialogOpen(false);
    if (!confirmed) {
      setSnackbar({
        open: true,
        message: translate("approvalCancelled", language),
        severity: "info",
      });
    }
    setLessonToApprove(null);
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleNavigate = (path) => {
    navigate(path);
    onClose();
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const commonLinks = [
    { path: "/profile", icon: <Person />, text: translate("myProfile", language) },
    { path: "/lessons", icon: <Book />, text: translate("browseLessons", language) },
  ];

  const learnerLinks = [
    { path: "/learner", icon: <Home />, text: translate("dashboard", language) },
  ];

  const contributorLinks = [
    {
      path: "/contributor/new",
      icon: <CloudUpload />,
      text: translate("startUploading", language),
    },
    {
      path: "/contributor/my-uploads",
      icon: <Book />,
      text: translate("myUploads", language),
    },
    {
      path: "/contributor/stats",
      icon: <BarChart />,
      text: translate("uploadStats", language),
    },
  ];

  const adminContentLinks = [
    {
      icon: <CheckCircle />,
      text: translate("pendingApprovals", language),
      badge: pendingApprovalsCount,
      onClick: fetchPendingLessons,
    },
    {
      path: "/admin/lessons",
      icon: <Book />,
      text: translate("allLessons", language),
    },
    {
      path: "/admin/analytics",
      icon: <BarChart />,
      text: translate("contentAnalytics", language),
    },
  ];

  let links = [...learnerLinks, ...commonLinks];
  if (role === "contributor") {
    links = [...contributorLinks, ...commonLinks];
  } else if (role === "admin") {
    links = [
      { path: "/admin", icon: <Home />, text: translate("dashboard", language) },
      {
        text: translate("contentManagement", language),
        icon: <Book />,
        isSection: true,
        sectionKey: "content",
        children: adminContentLinks,
      },
      ...commonLinks,
    ];
  }

  // Prepare confirm message with dynamic lesson title translation
  const confirmMessage = lessonToApprove
    ? translate("confirmApprovalMessage", language).replace(
        "$title",
        lessonToApprove.title || translate("thisLesson", language)
      )
    : "";

  return (
    <>
      <Drawer
        anchor="left"
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            bgcolor: "#031227",
            color: "#e0e6f2",
          },
        }}
      >
        <List sx={{ width: 250 }}>
          {links.map((link, index) =>
            link.isSection ? (
              <React.Fragment key={index}>
                <ListItemButton onClick={() => toggleSection(link.sectionKey)}>
                  <ListItemIcon sx={{ color: "#e0e6f2" }}>
                    {link.icon}
                  </ListItemIcon>
                  <ListItemText primary={link.text} />
                  {expandedSections[link.sectionKey] ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse
                  in={expandedSections[link.sectionKey]}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    {link.children.map((child, cIndex) => (
                      <ListItemButton
                        key={cIndex}
                        sx={{ pl: 4 }}
                        onClick={() => {
                          if (child.onClick) child.onClick();
                          else if (child.path) {
                            handleNavigate(child.path);
                          }
                        }}
                      >
                        <ListItemIcon sx={{ color: "#e0e6f2" }}>
                          {child.icon}
                        </ListItemIcon>
                        <ListItemText primary={child.text} />
                        {child.badge && child.badge > 0 && (
                          <Badge badgeContent={child.badge} color="error" />
                        )}
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              </React.Fragment>
            ) : (
              <ListItemButton
                key={index}
                onClick={() => {
                  if (link.onClick) link.onClick();
                  else if (link.path) handleNavigate(link.path);
                }}
              >
                <ListItemIcon sx={{ color: "#e0e6f2" }}>{link.icon}</ListItemIcon>
                <ListItemText primary={link.text} />
                {link.badge && link.badge > 0 && (
                  <Badge badgeContent={link.badge} color="error" />
                )}
              </ListItemButton>
            )
          )}
        </List>
      </Drawer>

      <PendingApprovalsDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        pendingLessons={pendingLessons}
        onApproveClick={handleApproveClick}
        loadingApprove={loadingApprove}
        language={language}
      />

      <ConfirmDialog
        open={confirmDialogOpen}
        onClose={handleConfirmClose}
        onConfirm={handleConfirmApprove}
        message={confirmMessage}
        language={language}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={handleSnackbarClose}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Sidebar;
