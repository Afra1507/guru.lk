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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { API } from "../../api/axiosInstances";

const roles = ["LEARNER", "CONTRIBUTOR", "ADMIN"];

const UserManagement = () => {
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

  // New: handlers to close dialogs and show cancellation snackbar
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
    <Box p={3}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontWeight: 700,
          fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
          letterSpacing: "0.05em",
          color: "#001f54", // navy blue
        }}
      >
        User Management
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" p={5}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 3, // theme spacing(3) = 24px
          }}
        >
          {users.map((user) => (
            <Box
              key={user.userId}
              sx={{
                flex: "0 1 calc(33.33% - 16px)", // 3 cards per row approx minus gap
                maxWidth: "350px",
                minWidth: "280px",
                marginBottom: 3,
              }}
            >
              <Paper elevation={3} sx={{ p: 2 }}>
                <Typography variant="h6">{user.username}</Typography>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  {user.email}
                </Typography>

                <Typography variant="body2" gutterBottom>
                  <strong>Role:</strong> {formatRole(user.role)} <br />
                  <strong>Language:</strong> {user.preferredLanguage || "N/A"}{" "}
                  <br />
                  <strong>Region:</strong> {user.region || "N/A"} <br />
                  <strong>Low Income:</strong> {user.isLowIncome ? "Yes" : "No"}{" "}
                  <br />
                  <strong>Joined:</strong>{" "}
                  {new Date(user.createdAt).toLocaleDateString()}
                </Typography>

                <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
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
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => handleRoleChangeClick(user)}
                    disabled={user.username === currentUsername}
                  >
                    Change Role
                  </Button>
                </Box>
              </Paper>
            </Box>
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
