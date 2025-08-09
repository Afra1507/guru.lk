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

const PendingApprovalsDialog = ({
  open,
  onClose,
  pendingLessons,
  onApproveClick,
  loadingApprove,
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        Pending Lesson Approvals
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {pendingLessons.length === 0 ? (
          <Typography>No pending lessons to approve.</Typography>
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
                >
                  {loadingApprove ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    "Approve"
                  )}
                </Button>
              }
              disableGutters
              sx={{ mb: 1 }}
            >
              <ListItemText
                primary={
                  lesson.title || `Lesson ID: ${lesson.lessonId || lesson.id}`
                }
                secondary={`Uploaded by: ${
                  lesson.uploaderName || lesson.uploaderId || "Unknown"
                }`}
              />
            </ListItem>
          ))
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

const ConfirmDialog = ({ open, onClose, onConfirm, message }) => {
  return (
    <Dialog open={open} onClose={() => onClose(false)} maxWidth="xs" fullWidth>
      <DialogTitle>Confirm Approval</DialogTitle>
      <DialogContent>
        <Typography>{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(false)}>Cancel</Button>
        <Button variant="contained" onClick={() => onConfirm()} color="primary">
          Yes
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

  // New state for confirmation dialog
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [lessonToApprove, setLessonToApprove] = useState(null);

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

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

  // When approve button clicked: open confirmation dialog
  const handleApproveClick = (lessonId, lessonTitle) => {
    setLessonToApprove({ id: lessonId, title: lessonTitle });
    setConfirmDialogOpen(true);
  };

  // On confirm approval dialog Yes clicked
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
        message: "Lesson approved successfully!",
        severity: "success",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Failed to approve lesson.",
        severity: "error",
      });
    } finally {
      setLoadingApprove(false);
      setLessonToApprove(null);
    }
  };

  // On cancel approval dialog Cancel clicked
  const handleConfirmClose = (confirmed) => {
    setConfirmDialogOpen(false);
    if (!confirmed) {
      setSnackbar({
        open: true,
        message: "Approval cancelled.",
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
    { path: "/profile", icon: <Person />, text: "My Profile" },
    { path: "/lessons", icon: <Book />, text: "Browse Lessons" },
  ];

  const learnerLinks = [
    { path: "/learner", icon: <Home />, text: "Dashboard" },
  ];

  const contributorLinks = [
    {
      path: "/contributor/new",
      icon: <CloudUpload />,
      text: "Start Uploading",
    },
    { path: "/contributor/my-uploads", icon: <Book />, text: "My Uploads" },
    {
      path: "/contributor/stats",
      icon: <BarChart />,
      text: "Upload Statistics",
    },
  ];

  const adminContentLinks = [
    {
      icon: <CheckCircle />,
      text: "Pending Approvals",
      badge: pendingApprovalsCount,
      onClick: fetchPendingLessons,
    },
    { path: "/admin/lessons", icon: <Book />, text: "All Lessons" },
    { path: "/admin/analytics", icon: <BarChart />, text: "Content Analytics" },
  ];

  let links = [...learnerLinks, ...commonLinks];
  if (role === "contributor") {
    links = [...contributorLinks, ...commonLinks];
  } else if (role === "admin") {
    links = [
      { path: "/admin", icon: <Home />, text: "Dashboard" },
      {
        text: "Content Management",
        icon: <Book />,
        isSection: true,
        sectionKey: "content",
        children: adminContentLinks,
      },
      ...commonLinks,
    ];
  }

  return (
    <>
      <Drawer anchor="left" open={open} onClose={onClose}>
        <List sx={{ width: 250 }}>
          {links.map((link, index) =>
            link.isSection ? (
              <React.Fragment key={index}>
                <ListItemButton onClick={() => toggleSection(link.sectionKey)}>
                  <ListItemIcon>{link.icon}</ListItemIcon>
                  <ListItemText primary={link.text} />
                  {expandedSections[link.sectionKey] ? (
                    <ExpandLess />
                  ) : (
                    <ExpandMore />
                  )}
                </ListItemButton>
                <Collapse
                  in={expandedSections[link.sectionKey]}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    {link.children.map((child, idx) => (
                      <ListItemButton
                        sx={{ pl: 4 }}
                        key={idx}
                        onClick={
                          child.onClick
                            ? child.onClick
                            : () => handleNavigate(child.path)
                        }
                      >
                        <ListItemIcon>{child.icon}</ListItemIcon>
                        <ListItemText primary={child.text} />
                        {child.badge ? (
                          <Badge
                            badgeContent={child.badge}
                            color="error"
                            sx={{ ml: "auto" }}
                          />
                        ) : null}
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              </React.Fragment>
            ) : (
              <ListItem disablePadding key={index}>
                <ListItemButton onClick={() => handleNavigate(link.path)}>
                  <ListItemIcon>{link.icon}</ListItemIcon>
                  <ListItemText primary={link.text} />
                  {link.badge ? (
                    <Badge
                      badgeContent={link.badge}
                      color="error"
                      sx={{ ml: "auto" }}
                    />
                  ) : null}
                </ListItemButton>
              </ListItem>
            )
          )}
        </List>
      </Drawer>

      {/* Pending Approvals Dialog */}
      <PendingApprovalsDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        pendingLessons={pendingLessons}
        onApproveClick={handleApproveClick}
        loadingApprove={loadingApprove}
      />

      {/* Confirmation Dialog */}
      <ConfirmDialog
        open={confirmDialogOpen}
        onClose={handleConfirmClose}
        onConfirm={handleConfirmApprove}
        message={
          lessonToApprove
            ? `Are you sure you want to approve "${lessonToApprove.title}"?`
            : ""
        }
      />

      {/* Snackbar for success/error/info */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Sidebar;
