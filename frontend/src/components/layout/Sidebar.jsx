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
  styled,
  keyframes
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

// Animation keyframes
const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-3px); }
  100% { transform: translateY(0px); }
`;

const pulseAnimation = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(79, 195, 247, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(79, 195, 247, 0); }
  100% { box-shadow: 0 0 0 0 rgba(79, 195, 247, 0); }
`;

// Color palette
const colors = {
  primary: "#002855",
  secondary: "#4fc3f7",
  accent: "#FFC107",
  darkBg: "#031227",
  lightText: "#e0e0e0",
  glassBorder: "rgba(255, 255, 255, 0.1)"
};

// Styled components
const GlassDrawer = styled(Drawer)({
  "& .MuiDrawer-paper": {
    background: `linear-gradient(135deg, rgba(3, 18, 39, 0.95), rgba(3, 18, 39, 0.85))`,
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    borderRight: `1px solid ${colors.glassBorder}`,
    boxShadow: "0 8px 32px rgba(0, 40, 85, 0.5)",
    width: 280,
    paddingTop: "16px",
    paddingBottom: "16px",
    zIndex: 1300,
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "linear-gradient(135deg, rgba(0, 40, 85, 0.6), transparent)",
      zIndex: -1
    }
  }
});

const AnimatedListItemButton = styled(ListItemButton)(({ theme }) => ({
  borderRadius: "12px",
  margin: "4px 12px",
  padding: "10px 16px",
  transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
  background: "rgba(0, 40, 85, 0.3)",
  "&:hover": {
    background: "rgba(79, 195, 247, 0.15)",
    transform: "translateX(4px) scale(1.02)",
    boxShadow: "0 4px 20px rgba(79, 195, 247, 0.2)",
    "& .MuiListItemIcon-root": {
      color: colors.accent,
      transform: "scale(1.2)"
    },
    "& .MuiListItemText-primary": {
      color: colors.accent,
      textShadow: "0 0 8px rgba(255, 193, 7, 0.5)"
    }
  },
  "&.Mui-selected": {
    background: "rgba(79, 195, 247, 0.25)",
    borderLeft: `3px solid ${colors.secondary}`
  }
}));

const AnimatedListItemIcon = styled(ListItemIcon)({
  color: colors.secondary,
  transition: "all 0.3s ease",
  minWidth: "36px !important"
});

const AnimatedListItemText = styled(ListItemText)({
  "& .MuiTypography-root": {
    color: colors.lightText,
    fontWeight: 500,
    fontSize: "0.95rem",
    letterSpacing: "0.5px",
    transition: "all 0.3s ease"
  }
});

const Backdrop = styled("div")(({ open }) => ({
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  pointerEvents: open ? "auto" : "none",
  opacity: open ? 1 : 0,
  transition: "opacity 0.4s ease",
  backdropFilter: open ? "blur(8px)" : "none",
  WebkitBackdropFilter: open ? "blur(8px)" : "none",
  backgroundColor: open ? "rgba(3, 18, 39, 0.5)" : "transparent",
  zIndex: 1200
}));

const PremiumBadge = styled(Badge)({
  "& .MuiBadge-badge": {
    right: -3,
    top: 8,
    border: `2px solid ${colors.darkBg}`,
    padding: "0 4px",
    animation: `${pulseAnimation} 2s infinite`,
    fontWeight: "bold"
  }
});

const SectionHeader = styled(ListItemButton)({
  "&:hover": {
    "& .MuiListItemIcon-root": {
      animation: `${floatAnimation} 2s ease-in-out infinite`
    }
  }
});

const GlassDialog = styled(Dialog)({
  "& .MuiPaper-root": {
    background: `linear-gradient(135deg, rgba(3, 18, 39, 0.98), rgba(3, 18, 39, 0.9))`,
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    border: `1px solid ${colors.glassBorder}`,
    borderRadius: "16px",
    boxShadow: "0 8px 32px rgba(0, 40, 85, 0.6)",
    color: colors.lightText
  }
});

const DialogTitleStyled = styled(DialogTitle)({
  background: `linear-gradient(90deg, ${colors.primary}, transparent)`,
  borderBottom: `1px solid ${colors.glassBorder}`,
  color: colors.accent,
  fontWeight: "bold",
  letterSpacing: "1px",
  padding: "16px 24px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
});

const DialogContentStyled = styled(DialogContent)({
  padding: "24px",
  "& .MuiListItem-root": {
    background: "rgba(0, 40, 85, 0.3)",
    borderRadius: "8px",
    marginBottom: "8px",
    transition: "all 0.3s ease",
    "&:hover": {
      background: "rgba(79, 195, 247, 0.15)"
    }
  }
});

const DialogActionsStyled = styled(DialogActions)({
  borderTop: `1px solid ${colors.glassBorder}`,
  padding: "16px 24px",
  justifyContent: "flex-end"
});

const ApproveButton = styled(Button)({
  background: `linear-gradient(90deg, ${colors.accent}, #FFAB00)`,
  color: "#000",
  fontWeight: "bold",
  borderRadius: "8px",
  padding: "8px 20px",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: `0 4px 12px rgba(255, 193, 7, 0.4)`,
    background: `linear-gradient(90deg, ${colors.accent}, #FF8F00)`
  },
  "&:disabled": {
    background: "rgba(255, 193, 7, 0.5)"
  }
});

const SecondaryButton = styled(Button)({
  border: `1px solid ${colors.secondary}`,
  color: colors.secondary,
  fontWeight: "bold",
  borderRadius: "8px",
  padding: "8px 20px",
  marginRight: "12px",
  transition: "all 0.3s ease",
  "&:hover": {
    background: "rgba(79, 195, 247, 0.1)",
    transform: "translateY(-2px)",
    boxShadow: `0 4px 12px rgba(79, 195, 247, 0.2)`
  }
});

const PendingApprovalsDialog = ({
  open,
  onClose,
  pendingLessons,
  onApproveClick,
  loadingApprove,
  language,
}) => {
  return (
    <GlassDialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitleStyled>
        {translate("pendingLessonApprovals", language)}
        <IconButton
          aria-label={translate("close", language)}
          onClick={onClose}
          sx={{ color: colors.accent }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitleStyled>

      <DialogContentStyled dividers>
        {pendingLessons.length === 0 ? (
          <Typography sx={{ color: colors.lightText }}>
            {translate("noPendingLessons", language)}
          </Typography>
        ) : (
          pendingLessons.map((lesson) => (
            <ListItem
              key={lesson.lessonId || lesson.id}
              secondaryAction={
                <ApproveButton
                  variant="contained"
                  onClick={() =>
                    onApproveClick(lesson.lessonId || lesson.id, lesson.title)
                  }
                  disabled={loadingApprove}
                >
                  {loadingApprove ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    translate("approve", language)
                  )}
                </ApproveButton>
              }
              sx={{
                mb: 1,
                px: 2,
                py: 1.5,
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateX(4px)"
                }
              }}
            >
              <ListItemText
                primary={
                  <Typography sx={{ color: colors.lightText, fontWeight: 500 }}>
                    {lesson.title ||
                    `${translate("lessonId", language)}: ${
                      lesson.lessonId || lesson.id
                    }`}
                  </Typography>
                }
                secondary={
                  <Typography sx={{ color: colors.secondary, fontSize: "0.8rem" }}>
                    {`${translate("uploadedBy", language)}: ${
                      lesson.uploaderName ||
                      lesson.uploaderId ||
                      translate("unknown", language)
                    }`}
                  </Typography>
                }
              />
            </ListItem>
          ))
        )}
      </DialogContentStyled>

      <DialogActionsStyled>
        <SecondaryButton onClick={onClose}>
          {translate("close", language)}
        </SecondaryButton>
      </DialogActionsStyled>
    </GlassDialog>
  );
};

const ConfirmDialog = ({ open, onClose, onConfirm, message, language }) => {
  return (
    <GlassDialog open={open} onClose={() => onClose(false)} maxWidth="xs" fullWidth>
      <DialogTitleStyled>
        {translate("confirmApproval", language)}
        <IconButton
          aria-label={translate("close", language)}
          onClick={() => onClose(false)}
          sx={{ color: colors.accent }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitleStyled>
      <DialogContentStyled>
        <Typography sx={{ color: colors.lightText }}>{message}</Typography>
      </DialogContentStyled>
      <DialogActionsStyled>
        <SecondaryButton onClick={() => onClose(false)}>
          {translate("cancel", language)}
        </SecondaryButton>
        <ApproveButton variant="contained" onClick={() => onConfirm()}>
          {translate("yes", language)}
        </ApproveButton>
      </DialogActionsStyled>
    </GlassDialog>
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
    {
      path: "/profile",
      icon: <Person />,
      text: translate("myProfile", language),
    },
    {
      path: "/lessons",
      icon: <Book />,
      text: translate("browseLessons", language),
    },
  ];

  const learnerLinks = [
    {
      path: "/learner",
      icon: <Home />,
      text: translate("dashboard", language),
    },
  ];

  const contributorLinks = [
    {
      path: "/contributor",
      icon: <Home />,
      text: translate("dashboard", language),
    },
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
      {
        path: "/admin",
        icon: <Home />,
        text: translate("dashboard", language),
      },
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

  const confirmMessage = lessonToApprove
    ? translate("confirmApprovalMessage", language).replace(
        "$title",
        lessonToApprove.title || translate("thisLesson", language)
      )
    : "";

  return (
    <>
      {/* Premium glass backdrop */}
      <Backdrop open={open} onClick={onClose} />

      <GlassDrawer
        anchor="left"
        open={open}
        onClose={onClose}
        ModalProps={{
          keepMounted: true // Better open performance on mobile
        }}
      >
        <List disablePadding sx={{ pt: 1 }}>
          {links.map((link, idx) => {
            if (link.isSection) {
              const isExpanded = expandedSections[link.sectionKey];
              return (
                <React.Fragment key={link.sectionKey || idx}>
                  <SectionHeader 
                    onClick={() => toggleSection(link.sectionKey)}
                    sx={{
                      background: isExpanded ? "rgba(79, 195, 247, 0.1)" : "transparent",
                      borderLeft: isExpanded ? `3px solid ${colors.secondary}` : "none"
                    }}
                  >
                    <AnimatedListItemIcon>{link.icon}</AnimatedListItemIcon>
                    <AnimatedListItemText primary={link.text} />
                    {isExpanded ? (
                      <ExpandLess sx={{ color: colors.secondary }} />
                    ) : (
                      <ExpandMore sx={{ color: colors.secondary }} />
                    )}
                  </SectionHeader>
                  <Collapse 
                    in={isExpanded} 
                    timeout="auto" 
                    unmountOnExit
                    sx={{
                      background: "rgba(0, 40, 85, 0.2)",
                      borderRadius: "0 0 12px 12px",
                      margin: "0 12px",
                      borderLeft: `1px solid ${colors.glassBorder}`
                    }}
                  >
                    <List component="div" disablePadding>
                      {link.children.map((child, childIdx) => (
                        <AnimatedListItemButton
                          key={child.path || child.text || childIdx}
                          onClick={child.onClick ? child.onClick : () => handleNavigate(child.path)}
                          sx={{ pl: 4 }}
                        >
                          <AnimatedListItemIcon>
                            {child.badge ? (
                              <PremiumBadge
                                badgeContent={child.badge}
                                color="error"
                                max={99}
                              >
                                {child.icon}
                              </PremiumBadge>
                            ) : (
                              child.icon
                            )}
                          </AnimatedListItemIcon>
                          <AnimatedListItemText primary={child.text} />
                        </AnimatedListItemButton>
                      ))}
                    </List>
                  </Collapse>
                </React.Fragment>
              );
            }
            return (
              <AnimatedListItemButton
                key={link.path || link.text || idx}
                onClick={link.onClick ? link.onClick : () => handleNavigate(link.path)}
              >
                <AnimatedListItemIcon>{link.icon}</AnimatedListItemIcon>
                <AnimatedListItemText primary={link.text} />
              </AnimatedListItemButton>
            );
          })}
        </List>
      </GlassDrawer>

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
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          variant="filled"
          sx={{ 
            width: "100%",
            background: snackbar.severity === "error" 
              ? "linear-gradient(90deg, #d32f2f, #b71c1c)"
              : snackbar.severity === "success"
              ? "linear-gradient(90deg, #388e3c, #1b5e20)"
              : "linear-gradient(90deg, #1976d2, #0d47a1)",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.25)",
            borderRadius: "12px",
            fontWeight: "bold"
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Sidebar;