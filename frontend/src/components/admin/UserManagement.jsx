import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
  CircularProgress,
  Avatar,
  Stack,
  Divider,
  Tooltip,
  useTheme,
  keyframes,
  styled
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import LanguageIcon from "@mui/icons-material/Language";
import PublicIcon from "@mui/icons-material/Public";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { API } from "../../api/axiosInstances";

// Animation keyframes
const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-3px); }
  100% { transform: translateY(0px); }
`;

const pulseAnimation = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(25, 118, 210, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(25, 118, 210, 0); }
  100% { box-shadow: 0 0 0 0 rgba(25, 118, 210, 0); }
`;

// Styled components
const GlassPaper = styled(Paper)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  borderRadius: "16px",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "4px",
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    borderRadius: "16px 16px 0 0",
  },
}));

const PremiumButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  color: "white",
  fontWeight: "bold",
  letterSpacing: "0.5px",
  borderRadius: "12px",
  padding: theme.spacing(1.5, 3),
  boxShadow: "0 4px 14px rgba(25, 118, 210, 0.3)",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: `0 6px 20px rgba(25, 118, 210, 0.4)`,
  },
}));

const StatusChip = styled(Box)(({ theme, role }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: theme.spacing(0.5),
  padding: theme.spacing(0.5, 1.5),
  borderRadius: "20px",
  background: role === "ADMIN" 
    ? "rgba(25, 118, 210, 0.15)" 
    : role === "CONTRIBUTOR" 
      ? "rgba(255, 152, 0, 0.15)" 
      : "rgba(56, 142, 60, 0.15)",
  color: role === "ADMIN" 
    ? theme.palette.primary.main 
    : role === "CONTRIBUTOR" 
      ? theme.palette.warning.main 
      : theme.palette.success.main,
  fontWeight: "600",
  fontSize: "0.8rem",
}));

const roles = ["LEARNER", "CONTRIBUTOR", "ADMIN"];

const UserManagement = () => {
  const theme = useTheme();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUsername, setCurrentUsername] = useState("");

  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [userToUpdate, setUserToUpdate] = useState(null);
  const [newRole, setNewRole] = useState("");

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  useEffect(() => {
    const userData = localStorage.getItem("user");
    try {
      const parsed = userData ? JSON.parse(userData) : null;
      setCurrentUsername(parsed?.username || "");
    } catch {
      setCurrentUsername("");
    }
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await API.get("/user/admin/all");
      setUsers(res.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch users. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (user) => {
    if (user.username === currentUsername) {
      setSnackbar({
        open: true,
        message: "You cannot delete your own account.",
        severity: "warning",
      });
      return;
    }
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await API.delete(`/user/admin/${userToDelete.userId}`);
      setUsers(users.filter((u) => u.userId !== userToDelete.userId));
      setShowDeleteModal(false);
      setUserToDelete(null);
      setSnackbar({
        open: true,
        message: "User deleted successfully.",
        severity: "success",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Failed to delete user. Please try again.",
        severity: "error",
      });
    }
  };

  const handleRoleChangeClick = (user) => {
    if (user.username === currentUsername) {
      setSnackbar({
        open: true,
        message: "You cannot modify your own role.",
        severity: "warning",
      });
      return;
    }
    setUserToUpdate(user);
    setNewRole(user.role);
    setShowRoleModal(true);
  };
  const formatRole = (role) => {
    if (!role) return "";
    return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
  };

  const confirmRoleUpdate = async () => {
    try {
      await API.put(`/user/admin/${userToUpdate.userId}/role`, null, {
        params: { role: newRole },
      });
      setUsers(
        users.map((u) =>
          u.userId === userToUpdate.userId ? { ...u, role: newRole } : u
        )
      );
      setShowRoleModal(false);
      setUserToUpdate(null);
      setSnackbar({
        open: true,
        message: "User role updated successfully.",
        severity: "success",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Failed to update user role. Please try again.",
        severity: "error",
      });
    }
  };

  const handleDeleteDialogClose = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
    setSnackbar({
      open: true,
      message: "Delete action cancelled.",
      severity: "info",
    });
  };

  const handleRoleDialogClose = () => {
    setShowRoleModal(false);
    setUserToUpdate(null);
    setSnackbar({
      open: true,
      message: "Role update cancelled.",
      severity: "info",
    });
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: 8,
        px: { xs: 2, sm: 4 },
        background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)",
      }}
    >
      <Box display="flex" justifyContent="center">
        <GlassPaper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 1400 }}>
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
                User Management
              </Typography>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <CalendarTodayIcon fontSize="small" />
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Typography>
            </Box>

            <Box display="flex" gap={2}>
              <Typography variant="body1" color="text.secondary">
                <strong>{users.length}</strong> users in system
              </Typography>
            </Box>
          </Box>

          {loading ? (
            <Box display="flex" justifyContent="center" p={5}>
              <CircularProgress 
                color="primary" 
                size={50} 
                sx={{ animation: `${pulseAnimation} 2s infinite` }}
              />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ maxWidth: 600, mx: "auto", borderRadius: '12px' }}>
              {error}
            </Alert>
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(3, 1fr)",
                },
                gap: 3,
              }}
            >
              {users.map((user) => (
                <Paper
                  key={user.userId}
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    transition: "all 0.3s ease",
                    background: "rgba(255, 255, 255, 0.8)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(0, 0, 0, 0.05)",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: `0 12px 24px rgba(25, 118, 210, 0.15)`,
                      borderColor: "rgba(25, 118, 210, 0.2)"
                    },
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                    <Avatar 
                      sx={{ 
                        bgcolor: theme.palette.primary.main,
                        width: 48,
                        height: 48,
                        animation: `${pulseAnimation} 2s infinite`
                      }}
                    >
                      <PersonIcon />
                    </Avatar>
                    <Box>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}
                      >
                        {user.username}
                        {user.username === currentUsername && (
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              bgcolor: theme.palette.primary.light,
                              color: theme.palette.primary.contrastText,
                              px: 1,
                              py: 0.5,
                              borderRadius: '4px'
                            }}
                          >
                            You
                          </Typography>
                        )}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {user.email}
                      </Typography>
                    </Box>
                  </Stack>

                  <Divider sx={{ mb: 2 }} />

                  <Stack spacing={1.5} mb={3}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Role
                      </Typography>
                      <StatusChip role={user.role}>
                        {formatRole(user.role)}
                      </StatusChip>
                    </Box>

                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Language & Region
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <LanguageIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {user.preferredLanguage || "Not specified"}
                        </Typography>
                        <PublicIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {user.region || "Not specified"}
                        </Typography>
                      </Stack>
                    </Box>

                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Financial Status
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <MonetizationOnIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {user.isLowIncome ? "Low income" : "Standard"}
                        </Typography>
                      </Stack>
                    </Box>

                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Member Since
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(user.createdAt)}
                      </Typography>
                    </Box>
                  </Stack>

                  <Box display="flex" justifyContent="flex-end" gap={1}>
                    <Tooltip 
                      title={user.username === currentUsername ? "You cannot delete your own account" : "Delete User"}
                      arrow
                    >
                      <span>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleDeleteClick(user)}
                          disabled={user.username === currentUsername}
                          sx={{
                            borderRadius: '8px',
                            textTransform: 'none'
                          }}
                        >
                          Delete
                        </Button>
                      </span>
                    </Tooltip>

                    <Tooltip 
                      title={user.username === currentUsername ? "You cannot modify your own role" : "Change User Role"}
                      arrow
                    >
                      <span>
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<EditIcon />}
                          onClick={() => handleRoleChangeClick(user)}
                          disabled={user.username === currentUsername}
                          sx={{
                            borderRadius: '8px',
                            textTransform: 'none',
                            background: theme.palette.primary.main,
                            '&:hover': {
                              background: theme.palette.primary.dark
                            }
                          }}
                        >
                          Edit Role
                        </Button>
                      </span>
                    </Tooltip>
                  </Box>
                </Paper>
              ))}
            </Box>
          )}

          {/* Delete Confirmation Dialog */}
          <Dialog
            open={showDeleteModal}
            onClose={handleDeleteDialogClose}
            maxWidth="xs"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: '12px',
                borderTop: `4px solid ${theme.palette.error.main}`
              }
            }}
          >
            <DialogTitle sx={{ fontWeight: 600 }}>Confirm User Deletion</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to permanently delete user{" "}
                <strong>{userToDelete?.username}</strong>? This action cannot be undone.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button 
                onClick={handleDeleteDialogClose}
                sx={{ borderRadius: '8px' }}
              >
                Cancel
              </Button>
              <Button 
                color="error" 
                onClick={confirmDelete}
                variant="contained"
                sx={{ borderRadius: '8px' }}
              >
                Confirm Delete
              </Button>
            </DialogActions>
          </Dialog>

          {/* Change Role Dialog */}
          <Dialog
            open={showRoleModal}
            onClose={handleRoleDialogClose}
            maxWidth="xs"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: '12px',
                borderTop: `4px solid ${theme.palette.primary.main}`
              }
            }}
          >
            <DialogTitle sx={{ fontWeight: 600 }}>
              Update Role for {userToUpdate?.username}
            </DialogTitle>
            <DialogContent>
              <FormControl fullWidth margin="normal">
                <InputLabel id="role-select-label">Select New Role</InputLabel>
                <Select
                  labelId="role-select-label"
                  value={newRole}
                  label="Select New Role"
                  onChange={(e) => setNewRole(e.target.value)}
                  sx={{ borderRadius: '8px' }}
                >
                  {roles.map((r) => (
                    <MenuItem key={r} value={r}>
                      {r.charAt(0) + r.slice(1).toLowerCase()}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button 
                onClick={handleRoleDialogClose}
                sx={{ borderRadius: '8px' }}
              >
                Cancel
              </Button>
              <Button 
                variant="contained" 
                onClick={confirmRoleUpdate}
                sx={{ borderRadius: '8px' }}
              >
                Update Role
              </Button>
            </DialogActions>
          </Dialog>

          {/* Snackbar for notifications */}
          <Snackbar
            open={snackbar.open}
            autoHideDuration={4000}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <Alert
              severity={snackbar.severity}
              onClose={() => setSnackbar({ ...snackbar, open: false })}
              sx={{ 
                width: "100%",
                borderRadius: '8px',
                boxShadow: theme.shadows[4]
              }}
              elevation={4}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </GlassPaper>
      </Box>
    </Box>
  );
};

export default UserManagement;