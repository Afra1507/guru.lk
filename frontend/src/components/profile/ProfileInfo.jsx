import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  useTheme,
  useMediaQuery,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  FaUserEdit,
  FaLanguage,
  FaMapMarkerAlt,
  FaUserShield,
  FaTools,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { API } from "../../api/axiosInstances";

const ProfileInfo = ({ user, setUser }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up("sm"));

  const [showEdit, setShowEdit] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...user });

  // New state for snackbars
  const [successSnackbar, setSuccessSnackbar] = useState(false);
  const [errorSnackbar, setErrorSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!user) return null;

  const role = user.role?.toUpperCase();

  const getRoleBadge = () => {
    let color = "primary";
    let label = "Learner";

    switch (role) {
      case "ADMIN":
        color = "error";
        label = "Admin";
        break;
      case "CONTRIBUTOR":
        color = "success";
        label = "Contributor";
        break;
      default:
        color = "primary";
        label = "Learner";
    }

    return (
      <Box
        component="span"
        sx={{
          bgcolor: (theme) => theme.palette[color].main,
          color: "white",
          borderRadius: 2,
          px: 2,
          py: 0.5,
          fontWeight: "bold",
          fontSize: "0.875rem",
          display: "inline-block",
          minWidth: 85,
          textAlign: "center",
        }}
      >
        {label}
      </Box>
    );
  };

  const getLanguageDisplayName = (code) => {
    if (!code) return "Not specified";
    switch (code.toUpperCase()) {
      case "SINHALA":
        return "සිංහල";
      case "TAMIL":
        return "தமிழ்";
      case "ENGLISH":
      default:
        return "English";
    }
  };

  const handleSaveChanges = async () => {
    try {
      const payload = {
        email: editedUser.email,
        preferredLanguage: editedUser.preferredLanguage,
        region: editedUser.region,
        isLowIncome: editedUser.isLowIncome,
      };

      const res = await API.put("/user/profile", payload);
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
      setShowConfirm(false);
      setShowEdit(false);
      setSuccessSnackbar(true); // show success message
    } catch (error) {
      setShowConfirm(false);
      setErrorMessage(
        error.response?.data?.message || "Failed to update profile."
      );
      setErrorSnackbar(true); // show error message
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        p: 2,
        fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
      }}
    >
      <Card
        sx={{
          p: 2,
          boxShadow: 4,
          borderRadius: 3,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <CardHeader
          title={
            <Typography variant={isSmUp ? "h5" : "h6"} fontWeight="bold">
              Profile Information
            </Typography>
          }
          action={
            <Button
              variant="outlined"
              startIcon={<FaUserEdit />}
              size="small"
              onClick={() => setShowEdit(true)}
            >
              Edit Profile
            </Button>
          }
        />
        <CardContent>
          <List sx={{ width: "100%" }}>
            {[
              { label: "Username", value: user.username },
              { label: "Email", value: user.email || "Not specified" },
            ].map(({ label, value }) => (
              <ListItem key={label} sx={{ py: 1 }}>
                <ListItemText
                  primary={
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ fontWeight: 500 }}
                    >
                      {label}
                    </Typography>
                  }
                />
                <Typography
                  variant="body1"
                  sx={{ fontWeight: "bold", minWidth: 150, textAlign: "right" }}
                >
                  {value}
                </Typography>
              </ListItem>
            ))}

            <ListItem sx={{ py: 1 }}>
              <ListItemText
                primary={
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ fontWeight: 500 }}
                  >
                    Account Type
                  </Typography>
                }
              />
              {getRoleBadge()}
            </ListItem>

            {role !== "ADMIN" && (
              <>
                <ListItem sx={{ py: 1 }}>
                  <ListItemIcon sx={{ minWidth: 30 }}>
                    <FaLanguage />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ fontWeight: 500 }}
                      >
                        Preferred Language
                      </Typography>
                    }
                  />
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: "bold",
                      minWidth: 150,
                      textAlign: "right",
                    }}
                  >
                    {getLanguageDisplayName(user.preferredLanguage)}
                  </Typography>
                </ListItem>

                <ListItem sx={{ py: 1 }}>
                  <ListItemIcon sx={{ minWidth: 30 }}>
                    <FaMapMarkerAlt />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ fontWeight: 500 }}
                      >
                        Region
                      </Typography>
                    }
                  />
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: "bold",
                      minWidth: 150,
                      textAlign: "right",
                    }}
                  >
                    {user.region || "Not specified"}
                  </Typography>
                </ListItem>

                <ListItem sx={{ py: 1 }}>
                  <ListItemIcon sx={{ minWidth: 30 }}>
                    <FaUserShield />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ fontWeight: 500 }}
                      >
                        Low Income
                      </Typography>
                    }
                  />
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: "bold",
                      minWidth: 150,
                      textAlign: "right",
                    }}
                  >
                    {user.isLowIncome ? "Yes" : "No"}
                  </Typography>
                </ListItem>
              </>
            )}

            {role === "ADMIN" && (
              <ListItem sx={{ py: 2 }}>
                <Button
                  variant="contained"
                  color="warning"
                  fullWidth
                  startIcon={<FaTools />}
                  onClick={() => navigate("/admin/users")}
                >
                  Go to User Management
                </Button>
              </ListItem>
            )}
          </List>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog
        open={showEdit}
        onClose={() => setShowEdit(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent dividers>
          <Box component="form" noValidate autoComplete="off" sx={{ mt: 1 }}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              value={editedUser.email || ""}
              onChange={(e) =>
                setEditedUser((prev) => ({ ...prev, email: e.target.value }))
              }
            />

            {role !== "ADMIN" && (
              <>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="language-select-label">
                    Preferred Language
                  </InputLabel>
                  <Select
                    labelId="language-select-label"
                    label="Preferred Language"
                    value={editedUser.preferredLanguage || "ENGLISH"}
                    onChange={(e) =>
                      setEditedUser((prev) => ({
                        ...prev,
                        preferredLanguage: e.target.value.toUpperCase(),
                      }))
                    }
                  >
                    <MenuItem value="ENGLISH">English</MenuItem>
                    <MenuItem value="SINHALA">සිංහල</MenuItem>
                    <MenuItem value="TAMIL">தமிழ்</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  label="Region"
                  fullWidth
                  margin="normal"
                  inputProps={{ maxLength: 100 }}
                  value={editedUser.region || ""}
                  onChange={(e) =>
                    setEditedUser((prev) => ({
                      ...prev,
                      region: e.target.value,
                    }))
                  }
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={!!editedUser.isLowIncome}
                      onChange={(e) =>
                        setEditedUser((prev) => ({
                          ...prev,
                          isLowIncome: e.target.checked,
                        }))
                      }
                    />
                  }
                  label="Low Income"
                />
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowEdit(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setShowConfirm(true)}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirm Save</DialogTitle>
        <DialogContent dividers>
          <Typography>Are you sure you want to save the changes?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfirm(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveChanges}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={successSnackbar}
        autoHideDuration={4000}
        onClose={() => setSuccessSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSuccessSnackbar(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Profile updated successfully!
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar
        open={errorSnackbar}
        autoHideDuration={6000}
        onClose={() => setErrorSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setErrorSnackbar(false)}
          severity="error"
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProfileInfo;
