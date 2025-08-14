import React, { useEffect, useState } from "react";
import {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  sendNotificationToUser,
  sendNotificationToRole,
  sendNotificationToAll,
} from "../services/notificationService";
import {
  getNotificationUserRole,
  getNotificationToken,
} from "../services/notificationUtils";
import NotificationPopupHandler from "../components/layout/NotificationPopupHandler";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  Button,
  TextField,
  CircularProgress,
  Snackbar,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Paper,
  Card,
  CardHeader,
  CardContent,
  Avatar,
  Chip,
  Tabs,
  Tab,
  Fade,
  Slide,
  Zoom,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  DoneAll as DoneAllIcon,
  MarkEmailRead as MarkEmailReadIcon,
  Send as SendIcon,
  Notifications as NotificationsIcon,
  NotificationsActive as NotificationsActiveIcon,
  Person as PersonIcon,
  Groups as GroupsIcon,
  Public as PublicIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Update as UpdateIcon,
} from "@mui/icons-material";

const Notifications = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const role = getNotificationUserRole();
  const authToken = getNotificationToken();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [targetRole, setTargetRole] = useState("LEARNER");
  const [notificationType, setNotificationType] = useState("INFO");
  const [targetUserId, setTargetUserId] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [sendMode, setSendMode] = useState("role");
  const [tabValue, setTabValue] = useState("all");

  const fetchNotifications = async () => {
    try {
      const data = await getMyNotifications();
      setNotifications(data);
    } catch (err) {
      console.error("Failed to load notifications:", err);
      showSnackbar("Failed to load notifications", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead(notificationId);
      setNotifications(
        notifications.map((n) =>
          n.notificationId === notificationId ? { ...n, isRead: true } : n
        )
      );
      showSnackbar("Notification marked as read");
    } catch (err) {
      console.error("Error marking as read:", err);
      showSnackbar("Error marking notification as read", "error");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const count = await markAllAsRead();
      fetchNotifications();
      showSnackbar(`${count} notifications marked as read`);
    } catch (err) {
      console.error("Error marking all as read:", err);
      showSnackbar("Error marking notifications as read", "error");
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      await deleteNotification(notificationId);
      setNotifications(
        notifications.filter((n) => n.notificationId !== notificationId)
      );
      showSnackbar("Notification deleted");
    } catch (err) {
      console.error("Error deleting notification:", err);
      showSnackbar("Error deleting notification", "error");
    }
  };

  const handleSendNotification = async () => {
    if (!message) return;

    try {
      if (sendMode === "role") {
        await sendNotificationToRole({
          role: targetRole,
          type: notificationType,
          message,
        });
        showSnackbar(`Notification sent to ${targetRole} role`);
      } else if (sendMode === "user") {
        await sendNotificationToUser({
          userId: targetUserId,
          type: notificationType,
          message,
        });
        showSnackbar(`Notification sent to user ${targetUserId}`);
      } else {
        await sendNotificationToAll({
          type: notificationType,
          message,
        });
        showSnackbar("Notification broadcasted to all users");
      }

      setMessage("");
      setTargetUserId("");
    } catch (err) {
      console.error("Error sending notification:", err);
      showSnackbar("Error sending notification", "error");
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const filteredNotifications = notifications.filter((n) => {
    if (tabValue === "unread") return !n.isRead;
    if (tabValue === "read") return n.isRead;
    return true;
  });

  const getTypeIcon = (type) => {
    switch (type) {
      case "WARNING":
        return <WarningIcon color="warning" />;
      case "ALERT":
        return <ErrorIcon color="error" />;
      case "UPDATE":
        return <UpdateIcon color="info" />;
      default:
        return <InfoIcon color="info" />;
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "300px",
        }}
      >
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: "1200px", mx: "auto", mt: 2, p: isMobile ? 1 : 3 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            flexWrap: "wrap",
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            <NotificationsActiveIcon
              color="primary"
              sx={{ verticalAlign: "middle", mr: 1, fontSize: "2rem" }}
            />
            Notifications
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleMarkAllAsRead}
            disabled={notifications.length === 0}
            startIcon={<DoneAllIcon />}
            sx={{
              borderRadius: 5,
              px: 3,
              py: 1,
              textTransform: "none",
              boxShadow: theme.shadows[4],
              "&:hover": {
                boxShadow: theme.shadows[8],
              },
            }}
          >
            Mark All as Read
          </Button>
        </Box>

        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          sx={{ mb: 3 }}
        >
          <Tab
            label="All"
            value="all"
            icon={<NotificationsIcon />}
            iconPosition="start"
          />
          <Tab
            label="Unread"
            value="unread"
            icon={<NotificationsActiveIcon />}
            iconPosition="start"
          />
          <Tab
            label="Read"
            value="read"
            icon={<MarkEmailReadIcon />}
            iconPosition="start"
          />
        </Tabs>

        {filteredNotifications.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              py: 8,
            }}
          >
            <NotificationsIcon sx={{ fontSize: 60, color: "text.disabled", mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No notifications found
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {filteredNotifications.map((notification, index) => (
              <Slide
                key={notification.notificationId}
                direction="up"
                in={true}
                mountOnEnter
                unmountOnExit
                timeout={index * 100}
              >
                <Paper
                  elevation={notification.isRead ? 1 : 3}
                  sx={{
                    mb: 2,
                    borderRadius: 2,
                    borderLeft: `4px solid ${
                      notification.isRead
                        ? theme.palette.grey[300]
                        : theme.palette.primary.main
                    }`,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: theme.shadows[6],
                    },
                  }}
                >
                  <ListItem
                    sx={{
                      py: 2,
                      px: 3,
                      bgcolor: notification.isRead
                        ? "background.paper"
                        : "primary.lighter",
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: notification.isRead
                          ? "grey.300"
                          : "primary.main",
                        mr: 2,
                      }}
                    >
                      {getTypeIcon(notification.type)}
                    </Avatar>
                    <ListItemText
                      primary={
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: notification.isRead ? 400 : 600,
                            color: notification.isRead
                              ? "text.secondary"
                              : "text.primary",
                          }}
                        >
                          {notification.message}
                        </Typography>
                      }
                      secondary={
                        <>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mt: 1,
                              flexWrap: "wrap",
                              gap: 1,
                            }}
                          >
                            <Chip
                              label={notification.type}
                              size="small"
                              variant="outlined"
                              color={
                                notification.type === "WARNING"
                                  ? "warning"
                                  : notification.type === "ALERT"
                                  ? "error"
                                  : "info"
                              }
                            />
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ display: "flex", alignItems: "center" }}
                            >
                              {new Date(
                                notification.createdAt
                              ).toLocaleString()}
                            </Typography>
                            {notification.referenceId && (
                              <Chip
                                label={`Ref: ${notification.referenceId}`}
                                size="small"
                                variant="outlined"
                              />
                            )}
                          </Box>
                        </>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        {!notification.isRead && (
                          <Zoom in={!notification.isRead}>
                            <IconButton
                              onClick={() =>
                                handleMarkAsRead(notification.notificationId)
                              }
                              edge="end"
                              color="primary"
                              sx={{
                                bgcolor: "primary.light",
                                "&:hover": {
                                  bgcolor: "primary.main",
                                  color: "white",
                                },
                              }}
                            >
                              <MarkEmailReadIcon fontSize="small" />
                            </IconButton>
                          </Zoom>
                        )}
                        <Fade in={true}>
                          <IconButton
                            onClick={() =>
                              handleDelete(notification.notificationId)
                            }
                            edge="end"
                            color="error"
                            sx={{
                              bgcolor: "error.light",
                              "&:hover": {
                                bgcolor: "error.main",
                                color: "white",
                              },
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Fade>
                      </Box>
                    </ListItemSecondaryAction>
                  </ListItem>
                </Paper>
              </Slide>
            ))}
          </List>
        )}
      </Paper>

      {role === "ADMIN" && (
        <Zoom in={true}>
          <Card
            elevation={4}
            sx={{
              borderRadius: 3,
              borderTop: `4px solid ${theme.palette.primary.main}`,
            }}
          >
            <CardHeader
              title="Send Notification"
              titleTypographyProps={{
                variant: "h5",
                color: "primary",
              }}
              avatar={
                <Avatar
                  sx={{
                    bgcolor: "primary.main",
                  }}
                >
                  <SendIcon />
                </Avatar>
              }
            />
            <CardContent>
              <Box sx={{ mb: 3 }}>
                <Tabs
                  value={sendMode}
                  onChange={(e, newValue) => setSendMode(newValue)}
                  variant="fullWidth"
                  indicatorColor="primary"
                  textColor="primary"
                >
                  <Tab
                    label="To Role"
                    value="role"
                    icon={<GroupsIcon />}
                    iconPosition="start"
                  />
                  <Tab
                    label="To User"
                    value="user"
                    icon={<PersonIcon />}
                    iconPosition="start"
                  />
                  <Tab
                    label="Broadcast"
                    value="broadcast"
                    icon={<PublicIcon />}
                    iconPosition="start"
                  />
                </Tabs>
              </Box>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                  gap: 3,
                  mb: 3,
                }}
              >
                {sendMode === "role" && (
                  <FormControl fullWidth>
                    <InputLabel>Target Role</InputLabel>
                    <Select
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                      label="Target Role"
                    >
                      <MenuItem value="LEARNER">Learner</MenuItem>
                      <MenuItem value="CONTRIBUTOR">Contributor</MenuItem>
                      <MenuItem value="ADMIN">Admin</MenuItem>
                    </Select>
                  </FormControl>
                )}

                {sendMode === "user" && (
                  <TextField
                    label="User ID"
                    fullWidth
                    value={targetUserId}
                    onChange={(e) => setTargetUserId(e.target.value)}
                    required
                  />
                )}

                <FormControl fullWidth>
                  <InputLabel>Notification Type</InputLabel>
                  <Select
                    value={notificationType}
                    onChange={(e) => setNotificationType(e.target.value)}
                    label="Notification Type"
                  >
                    <MenuItem value="INFO">
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <InfoIcon color="info" fontSize="small" />
                        Information
                      </Box>
                    </MenuItem>
                    <MenuItem value="WARNING">
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <WarningIcon color="warning" fontSize="small" />
                        Warning
                      </Box>
                    </MenuItem>
                    <MenuItem value="ALERT">
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <ErrorIcon color="error" fontSize="small" />
                        Alert
                      </Box>
                    </MenuItem>
                    <MenuItem value="UPDATE">
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <UpdateIcon color="info" fontSize="small" />
                        Update
                      </Box>
                    </MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <TextField
                label="Message"
                fullWidth
                multiline
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                sx={{ mb: 3 }}
                required
                variant="outlined"
              />

              <Button
                variant="contained"
                color="primary"
                onClick={handleSendNotification}
                disabled={
                  !message ||
                  (sendMode === "user" && !targetUserId) ||
                  (sendMode === "role" && !targetRole)
                }
                startIcon={<SendIcon />}
                fullWidth
                size="large"
                sx={{
                  borderRadius: 5,
                  py: 1.5,
                  textTransform: "none",
                  fontSize: "1rem",
                  boxShadow: theme.shadows[4],
                  "&:hover": {
                    boxShadow: theme.shadows[8],
                  },
                }}
              >
                {sendMode === "role" && `Send to ${targetRole} Role`}
                {sendMode === "user" && `Send to User ${targetUserId || ""}`}
                {sendMode === "broadcast" && "Broadcast to All Users"}
              </Button>
            </CardContent>
          </Card>
        </Zoom>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{
            width: "100%",
            boxShadow: theme.shadows[6],
            alignItems: "center",
          }}
          iconMapping={{
            success: <DoneAllIcon fontSize="inherit" />,
            error: <ErrorIcon fontSize="inherit" />,
            warning: <WarningIcon fontSize="inherit" />,
            info: <InfoIcon fontSize="inherit" />,
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Notifications;