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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import LanguageIcon from "@mui/icons-material/Language";
import PublicIcon from "@mui/icons-material/Public";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { API } from "../../api/axiosInstances";

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

  const formatRole = (role) => {
    if (!role) return "";
    return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
  };

  return (
    <Box p={{ xs: 2, md: 4 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontWeight: 700,
          fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
          letterSpacing: "0.05em",
          color: theme.palette.primary.dark,
          textAlign: "center",
          mb: 4,
        }}
      >
        User Management
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" p={5}>
          <CircularProgress color="primary" size={50} />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ maxWidth: 600, mx: "auto" }}>
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
            maxWidth: 1100,
            mx: "auto",
          }}
        >
          {users.map((user) => (
            <Paper
              key={user.userId}
              elevation={5}
              sx={{
                p: 3,
                borderRadius: 3,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: `0 12px 20px ${theme.palette.primary.light}`,
                },
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                  <PersonIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {user.username}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {user.email}
                  </Typography>
                </Box>
              </Stack>

              <Divider sx={{ mb: 2 }} />

              <Stack spacing={1} mb={2}>
                <Typography variant="body2" color="text.primary">
                  <strong>Role:</strong> {formatRole(user.role)}
                </Typography>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <LanguageIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {user.preferredLanguage || "N/A"}
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <PublicIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {user.region || "N/A"}
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <MonetizationOnIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    Low Income: {user.isLowIncome ? "Yes" : "No"}
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <CalendarTodayIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    Joined: {new Date(user.createdAt).toLocaleDateString()}
                  </Typography>
                </Stack>
              </Stack>

              <Box mt="auto" display="flex" justifyContent="flex-end" gap={1}>
                <Tooltip title={user.username === currentUsername ? "You cannot delete your own account" : "Delete User"}>
                  <span>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDeleteClick(user)}
                      disabled={user.username === currentUsername}
                    >
                      Delete
                    </Button>
                  </span>
                </Tooltip>

                <Tooltip title={user.username === currentUsername ? "You cannot modify your own role" : "Change User Role"}>
                  <span>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => handleRoleChangeClick(user)}
                      disabled={user.username === currentUsername}
                    >
                      Change Role
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
      >
        <DialogTitle>Confirm Delete User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete user{" "}
            <strong>{userToDelete?.username}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>Cancel</Button>
          <Button color="error" onClick={confirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Change Role Dialog */}
      <Dialog
        open={showRoleModal}
        onClose={handleRoleDialogClose}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Change Role for {userToUpdate?.username}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel id="role-select-label">Role</InputLabel>
            <Select
              labelId="role-select-label"
              value={newRole}
              label="Role"
              onChange={(e) => setNewRole(e.target.value)}
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
          <Button onClick={handleRoleDialogClose}>Cancel</Button>
          <Button variant="contained" onClick={confirmRoleUpdate}>
            Save
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
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserManagement;
