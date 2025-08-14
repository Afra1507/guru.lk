import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Slide,
  Paper,
  Typography,
  Button,
  Avatar,
  IconButton,
  Divider,
  Badge,
  Menu,
  MenuItem,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  Close as CloseIcon,
  Check as CheckIcon,
  Launch as LaunchIcon,
  MoreVert as MoreVertIcon,
  Snooze as SnoozeIcon,
} from "@mui/icons-material";
import { useNotifications } from "../../hooks/notificationHooks";
import {
  getRecentNotifications,
  markAsRead,
  getUnreadCount,
} from "../../services/notificationService";
import { useNavigate } from "react-router-dom";

const NewNotificationPopup = ({
  notification,
  onClose,
  onMarkAsRead,
  onView,
  onSnooze,
}) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const getNotificationIcon = (type) => {
    const iconStyle = { fontSize: 20 };
    switch (type) {
      case "ALERT":
        return <NotificationsIcon color="error" style={iconStyle} />;
      case "WARNING":
        return <NotificationsIcon color="warning" style={iconStyle} />;
      case "UPDATE":
        return <NotificationsIcon color="info" style={iconStyle} />;
      default:
        return <NotificationsIcon color="primary" style={iconStyle} />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "ALERT":
        return theme.palette.error.main;
      case "WARNING":
        return theme.palette.warning.main;
      case "UPDATE":
        return theme.palette.info.main;
      default:
        return theme.palette.primary.main;
    }
  };

  return (
    <Slide direction="left" in={true} mountOnEnter unmountOnExit>
      <Paper
        elevation={8}
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          width: 360,
          borderLeft: `4px solid ${getNotificationColor(notification.type)}`,
          borderRadius: "12px",
          bgcolor: theme.palette.background.paper,
          p: 2.5,
          zIndex: theme.zIndex.modal,
          boxShadow: `0px 8px 24px ${alpha(theme.palette.common.black, 0.12)}`,
          backdropFilter: "blur(4px)",
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          overflow: "hidden",
          "&:before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: `linear-gradient(90deg, ${getNotificationColor(
              notification.type
            )}, ${alpha(getNotificationColor(notification.type), 0.3)})`,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 1.5,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Badge
              color="error"
              variant="dot"
              invisible={notification.isRead}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              sx={{
                "& .MuiBadge-badge": {
                  right: 4,
                  bottom: 4,
                  width: 10,
                  height: 10,
                  border: `2px solid ${theme.palette.background.paper}`,
                },
              }}
            >
              <Avatar
                sx={{
                  bgcolor: alpha(getNotificationColor(notification.type), 0.1),
                  width: 40,
                  height: 40,
                  color: getNotificationColor(notification.type),
                }}
              >
                {getNotificationIcon(notification.type)}
              </Avatar>
            </Badge>
            <Box>
              <Typography
                variant="subtitle1"
                fontWeight={600}
                color="text.primary"
              >
                {notification.type === "ALERT"
                  ? "Important Alert"
                  : notification.type === "WARNING"
                  ? "System Warning"
                  : "New Notification"}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", lineHeight: 1.2 }}
              >
                {new Date(notification.createdAt).toLocaleString()}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              size="small"
              onClick={handleMenuClick}
              sx={{
                color: "text.secondary",
                "&:hover": {
                  backgroundColor: alpha(theme.palette.action.hover, 0.1),
                },
              }}
            >
              <MoreVertIcon fontSize="small" />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              PaperProps={{
                elevation: 4,
                sx: {
                  borderRadius: "8px",
                  minWidth: 180,
                  mt: 0.5,
                  "& .MuiMenuItem-root": {
                    typography: "body2",
                    fontSize: "0.875rem",
                  },
                },
              }}
            >
              <MenuItem
                onClick={() => {
                  onSnooze(60);
                  handleMenuClose();
                }}
                sx={{
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  },
                }}
              >
                <SnoozeIcon
                  fontSize="small"
                  sx={{ mr: 1.5, color: "text.secondary" }}
                />
                Snooze for 1 hour
              </MenuItem>
            </Menu>
            <IconButton
              size="small"
              onClick={onClose}
              sx={{
                color: "text.secondary",
                "&:hover": {
                  backgroundColor: alpha(theme.palette.action.hover, 0.1),
                },
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        <Typography
          variant="body2"
          sx={{
            mt: 1.5,
            mb: 1,
            color: "text.primary",
            lineHeight: 1.5,
            fontSize: "0.9375rem",
          }}
        >
          {notification.message}
        </Typography>

        {notification.referenceId && (
          <Typography
            variant="caption"
            sx={{
              display: "block",
              mt: 0.5,
              color: "text.disabled",
              fontFamily: "monospace",
            }}
          >
            REF: {notification.referenceId}
          </Typography>
        )}

        <Divider
          sx={{
            my: 2,
            borderColor: alpha(theme.palette.divider, 0.1),
          }}
        />

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 1.5,
          }}
        >
          <Button
            size="small"
            variant="outlined"
            startIcon={<CheckIcon fontSize="small" />}
            onClick={() => {
              onMarkAsRead(notification.notificationId);
              onClose();
            }}
            sx={{
              textTransform: "none",
              borderRadius: "8px",
              px: 2,
              py: 0.75,
              fontSize: "0.8125rem",
              color: "text.secondary",
              borderColor: alpha(theme.palette.divider, 0.3),
              "&:hover": {
                borderColor: alpha(theme.palette.divider, 0.5),
                backgroundColor: alpha(theme.palette.action.hover, 0.05),
              },
            }}
          >
            Dismiss
          </Button>
          <Button
            size="small"
            variant="contained"
            endIcon={<LaunchIcon fontSize="small" />}
            onClick={() => {
              onView();
              onClose();
            }}
            sx={{
              textTransform: "none",
              borderRadius: "8px",
              px: 2.5,
              py: 0.75,
              fontSize: "0.8125rem",
              backgroundColor: getNotificationColor(notification.type),
              "&:hover": {
                backgroundColor: alpha(
                  getNotificationColor(notification.type),
                  0.9
                ),
              },
            }}
          >
            View Details
          </Button>
        </Box>
      </Paper>
    </Slide>
  );
};

const NotificationPopupHandler = () => {
  const [newNotifications, setNewNotifications] = useState([]);
  const [currentPopup, setCurrentPopup] = useState(null);
  const [prevNotifications, setPrevNotifications] = useState([]);
  const [snoozedNotifications, setSnoozedNotifications] = useState([]);
  const [lastPollTime, setLastPollTime] = useState(0);
  const { unreadCount, refreshCount } = useNotifications();
  const navigate = useNavigate();
  const pollIntervalRef = useRef(null);

  // Smart polling control
  const startPolling = (immediate = false) => {
    stopPolling(); // Clear any existing interval

    if (immediate) {
      fetchAndCompareNotifications();
    }

    // Use exponential backoff when no new notifications found
    const baseInterval = 30000; // 30 seconds
    const maxInterval = 300000; // 5 minutes
    let currentInterval = baseInterval;

    pollIntervalRef.current = setInterval(async () => {
      const now = Date.now();
      if (now - lastPollTime < currentInterval) return;

      const hadNewNotifications = await fetchAndCompareNotifications();

      if (hadNewNotifications) {
        currentInterval = baseInterval; // Reset to fast polling
      } else {
        currentInterval = Math.min(currentInterval * 2, maxInterval); // Slow down
      }

      setLastPollTime(now);
    }, baseInterval);
  };

  const stopPolling = () => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  };

  const fetchAndCompareNotifications = async () => {
    try {
      const recentNotifications = await getRecentNotifications(5);

      // Filter out snoozed notifications
      const now = new Date();
      const activeSnoozes = snoozedNotifications.filter(
        (snooze) => new Date(snooze.expiresAt) > now
      );
      const snoozedIds = activeSnoozes.map((snooze) => snooze.notificationId);

      // Find truly new notifications
      const newOnes = recentNotifications.filter(
        (newNotif) =>
          !prevNotifications.some(
            (prevNotif) => prevNotif.notificationId === newNotif.notificationId
          ) &&
          !snoozedIds.includes(newNotif.notificationId) &&
          !newNotif.isRead
      );

      if (newOnes.length > 0) {
        setNewNotifications((prev) => [...newOnes.reverse(), ...prev]);
        setPrevNotifications(recentNotifications);
        refreshCount();
        return true; // Indicate new notifications were found
      }

      // Check if we should pause polling
      const hasUnread = recentNotifications.some((n) => !n.isRead);
      if (!hasUnread) {
        stopPolling();
      }

      setPrevNotifications(recentNotifications);
      refreshCount();
      return false;
    } catch (error) {
      console.error("Error checking notifications:", error);
      return false;
    }
  };

  // Initialize and clean up
  useEffect(() => {
    startPolling(true); // Start with immediate fetch

    return () => {
      stopPolling();
    };
  }, []);

  // Handle snooze expiration
  useEffect(() => {
    const now = new Date();
    const expiredSnoozes = snoozedNotifications.filter(
      (snooze) => new Date(snooze.expiresAt) <= now
    );

    if (expiredSnoozes.length > 0) {
      const expiredIds = expiredSnoozes.map((snooze) => snooze.notificationId);
      const toRestore = prevNotifications.filter((notif) =>
        expiredIds.includes(notif.notificationId)
      );

      if (toRestore.length > 0) {
        setNewNotifications((prev) => [...toRestore, ...prev]);
        startPolling(); // Restart polling if it was stopped
      }

      setSnoozedNotifications((prev) =>
        prev.filter((snooze) => new Date(snooze.expiresAt) > now)
      );
    }
  }, [snoozedNotifications]);

  // Show next notification in queue
  useEffect(() => {
    if (!currentPopup && newNotifications.length > 0) {
      setCurrentPopup(newNotifications[0]);
      setNewNotifications((prev) => prev.slice(1));
    }
  }, [currentPopup, newNotifications]);

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead(notificationId);
      const count = await getUnreadCount();
      if (count === 0) {
        stopPolling();
      }
      refreshCount();
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  return (
    <>
      {currentPopup && (
        <NewNotificationPopup
          notification={currentPopup}
          onClose={() => setCurrentPopup(null)}
          onMarkAsRead={handleMarkAsRead}
          onView={() => navigate("/notifications")}
          onSnooze={(mins) => {
            const expiresAt = new Date();
            expiresAt.setMinutes(expiresAt.getMinutes() + mins);
            setSnoozedNotifications((prev) => [
              ...prev,
              { notificationId: currentPopup.notificationId, expiresAt },
            ]);
            setCurrentPopup(null);
          }}
        />
      )}
    </>
  );
};

export default NotificationPopupHandler;
