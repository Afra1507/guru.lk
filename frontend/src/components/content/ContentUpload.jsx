import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
  Paper,
  styled,
  Grid,
  InputAdornment,
  CircularProgress,
  Divider,
  FormHelperText,
} from "@mui/material";
import contentService from "../../services/contentService";
import { jwtDecode } from "jwt-decode";

// Material UI Icons
import TitleIcon from "@mui/icons-material/Title";
import DescriptionIcon from "@mui/icons-material/Description";
import CategoryIcon from "@mui/icons-material/Category";
import LanguageIcon from "@mui/icons-material/Language";
import GroupIcon from "@mui/icons-material/Group";
import SubjectIcon from "@mui/icons-material/MenuBook";
import LinkIcon from "@mui/icons-material/Link";
import PersonIcon from "@mui/icons-material/Person";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import EventNoteIcon from "@mui/icons-material/EventNote";

// Color palette
const colors = {
  primary: "#1976d2",
  secondary: "#4fc3f7",
  accent: "#FFC107",
  darkBg: "#0a1929",
  lightText: "#f5f5f5",
  glassBorder: "rgba(255, 255, 255, 0.1)",
};

// Styled components
const GlassPanel = styled(Paper)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  borderRadius: "16px",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
  padding: theme.spacing(6),
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

const PremiumButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
  color: "white",
  fontWeight: "bold",
  letterSpacing: "0.5px",
  borderRadius: "12px",
  padding: theme.spacing(2, 4),
  boxShadow: "0 4px 14px rgba(25, 118, 210, 0.3)",
  transition: "all 0.3s ease",
  fontSize: "1rem",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: `0 6px 20px rgba(25, 118, 210, 0.4)`,
  },
  "&.Mui-disabled": {
    background: "#e0e0e0",
    color: "#9e9e9e",
  },
}));

const subjectsByCategory = {
  "Grades 1-9": [
    "Mathematics",
    "Science",
    "Sinhala",
    "Tamil",
    "English",
    "History",
    "Geography",
    "Civics",
    "Religion",
    "Health & Physical Education",
    "Art",
    "Music",
    "Information & Communication Technology",
    "Commerce",
    "Literature",
  ],
  "O-Level Subjects": [
    "Mathematics",
    "Science",
    "Sinhala",
    "Tamil",
    "English",
    "History",
    "Geography",
    "Civics",
    "Religion",
    "Health & Physical Education",
    "Art",
    "Music",
    "Information & Communication Technology",
    "Commerce",
    "Literature",
    "Combined Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "Accounting",
    "Business Studies",
    "Economics",
    "Agriculture",
    "Engineering Technology",
    "Political Science",
    "Logic",
  ],
  "A-Level Subjects": [
    "Physics",
    "Chemistry",
    "Biology",
    "Combined Mathematics",
    "Accounting",
    "Business Studies",
    "Economics",
    "Agriculture",
    "Engineering Technology",
    "Political Science",
    "Logic",
  ],
  "Campus Major Subjects": [
    "Computer Science",
    "Law",
    "Medicine",
    "Engineering",
    "Nursing",
    "Architecture",
    "Management",
    "Psychology",
    "Environmental Science",
    "Finance",
    "Marketing",
    "Statistics",
    "Economics",
    "Political Science",
    "Information Technology",
    "Business",
    "Data science",
    "Artificial Intelligence",
    "Cyber Security",
    "Software Engineering",
    "Web Development",
    "Mobile App Development",
    "Mathematics",
    "Applied Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "Bio Science",
  ],
  Other: ["Other"],
};

const ContentUpload = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    contentType: "text",
    subject: "",
    language: "sinhala",
    ageGroup: "all",
    fileUrl: "",
    uploaderId: null,
  });

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        const userId = decoded.userId || decoded.sub;

        setFormData((prev) => ({
          ...prev,
          uploaderId: userId,
        }));
      } catch (error) {
        console.error("Failed to decode token", error);
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when field is changed
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.description)
      newErrors.description = "Description is required";
    if (!formData.subject) newErrors.subject = "Subject is required";
    if (!formData.fileUrl) newErrors.fileUrl = "File URL is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (!formData.uploaderId) {
      setSnackbar({
        open: true,
        message: "User not authenticated.",
        severity: "error",
      });
      return;
    }

    try {
      setSubmitting(true);
      await contentService.createLesson(formData);

      setSnackbar({
        open: true,
        message: "Lesson created successfully! Waiting for approval.",
        severity: "success",
      });

      setFormData({
        title: "",
        description: "",
        contentType: "text",
        subject: "",
        language: "sinhala",
        ageGroup: "all",
        fileUrl: "",
        uploaderId: formData.uploaderId,
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message:
          "Submission failed: " + (err.response?.data?.message || err.message),
        severity: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSnackbarClose = (_, reason) => {
    if (reason === "clickaway") return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8ed 100%)",
        py: 8,
        px: { xs: 2, sm: 4 },
      }}
    >
      <Box display="flex" justifyContent="center">
        <GlassPanel elevation={3}>
          {/* Header */}
          <Box mb={4}>
            <Typography
              variant="h3"
              component="h1"
              fontWeight="700"
              color="text.primary"
              sx={{
                letterSpacing: "-0.5px",
                mb: 0.5,
                fontSize: { xs: "2rem", sm: "2.5rem" },
              }}
            >
              Upload New Content
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                fontSize: { xs: "0.9rem", sm: "1rem" },
              }}
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

          <Divider sx={{ my: 4 }} />

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={4}>
              {/* User ID */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={
                    <Box display="flex" alignItems="center" gap={1}>
                      <PersonIcon fontSize="medium" />
                      <Typography variant="body1" fontWeight="500">
                        User ID
                      </Typography>
                    </Box>
                  }
                  name="uploaderId"
                  value={formData.uploaderId || ""}
                  InputProps={{
                    readOnly: true,
                    style: { fontSize: "1rem" },
                  }}
                  variant="outlined"
                  size="medium"
                />
              </Grid>

              {/* Title */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={
                    <Box display="flex" alignItems="center" gap={1}>
                      <TitleIcon fontSize="medium" />
                      <Typography variant="body1" fontWeight="500">
                        Title
                      </Typography>
                    </Box>
                  }
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  error={!!errors.title}
                  helperText={errors.title}
                  variant="outlined"
                  size="medium"
                  InputProps={{
                    style: { fontSize: "1rem" },
                  }}
                />
              </Grid>

              {/* Description */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={
                    <Box display="flex" alignItems="center" gap={1}>
                      <DescriptionIcon fontSize="medium" />
                      <Typography variant="body1" fontWeight="500">
                        Description
                      </Typography>
                    </Box>
                  }
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  error={!!errors.description}
                  helperText={errors.description}
                  multiline
                  rows={5}
                  variant="outlined"
                  size="medium"
                  InputProps={{
                    style: { fontSize: "1rem" },
                  }}
                />
              </Grid>

              {/* Content Type, Language, Age Group */}
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel id="content-type-label" sx={{ fontSize: "1rem" }}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <CategoryIcon fontSize="medium" />
                      <Typography variant="body1" fontWeight="500">
                        Content Type
                      </Typography>
                    </Box>
                  </InputLabel>
                  <Select
                    labelId="content-type-label"
                    name="contentType"
                    value={formData.contentType}
                    onChange={handleChange}
                    label={
                      <Box display="flex" alignItems="center" gap={1}>
                        <CategoryIcon fontSize="medium" />
                        <Typography variant="body1" fontWeight="500">
                          Content Type
                        </Typography>
                      </Box>
                    }
                    sx={{ fontSize: "1rem" }}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 300,
                        },
                      },
                    }}
                  >
                    <MenuItem value="text" sx={{ fontSize: "1rem" }}>
                      Text
                    </MenuItem>
                    <MenuItem value="video" sx={{ fontSize: "1rem" }}>
                      Video
                    </MenuItem>
                    <MenuItem value="audio" sx={{ fontSize: "1rem" }}>
                      Audio
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel id="language-label" sx={{ fontSize: "1rem" }}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <LanguageIcon fontSize="medium" />
                      <Typography variant="body1" fontWeight="500">
                        Language
                      </Typography>
                    </Box>
                  </InputLabel>
                  <Select
                    labelId="language-label"
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    label={
                      <Box display="flex" alignItems="center" gap={1}>
                        <LanguageIcon fontSize="medium" />
                        <Typography variant="body1" fontWeight="500">
                          Language
                        </Typography>
                      </Box>
                    }
                    sx={{ fontSize: "1rem" }}
                  >
                    <MenuItem value="sinhala" sx={{ fontSize: "1rem" }}>
                      Sinhala
                    </MenuItem>
                    <MenuItem value="tamil" sx={{ fontSize: "1rem" }}>
                      Tamil
                    </MenuItem>
                    <MenuItem value="english" sx={{ fontSize: "1rem" }}>
                      English
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel id="age-group-label" sx={{ fontSize: "1rem" }}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <GroupIcon fontSize="medium" />
                      <Typography variant="body1" fontWeight="500">
                        Age Group
                      </Typography>
                    </Box>
                  </InputLabel>
                  <Select
                    labelId="age-group-label"
                    name="ageGroup"
                    value={formData.ageGroup}
                    onChange={handleChange}
                    label={
                      <Box display="flex" alignItems="center" gap={1}>
                        <GroupIcon fontSize="medium" />
                        <Typography variant="body1" fontWeight="500">
                          Age Group
                        </Typography>
                      </Box>
                    }
                    sx={{ fontSize: "1rem" }}
                  >
                    <MenuItem value="all" sx={{ fontSize: "1rem" }}>
                      All Ages
                    </MenuItem>
                    <MenuItem value="primary" sx={{ fontSize: "1rem" }}>
                      Primary School (5-10 years, Grades 1-5)
                    </MenuItem>
                    <MenuItem
                      value="junior_secondary"
                      sx={{ fontSize: "1rem" }}
                    >
                      Junior Secondary (10-13 years, Grades 6-9)
                    </MenuItem>
                    <MenuItem
                      value="senior_secondary"
                      sx={{ fontSize: "1rem" }}
                    >
                      Senior Secondary (14-16 years, Grades 10-11, GCE O-Level)
                    </MenuItem>
                    <MenuItem value="collegiate" sx={{ fontSize: "1rem" }}>
                      Collegiate Level (16-18/19 years, GCE A-Level)
                    </MenuItem>
                    <MenuItem value="postgrad" sx={{ fontSize: "1rem" }}>
                      Campus Postgraduates & Others
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Subject - Compact Version */}
              <Grid item xs={12}>
                <FormControl fullWidth error={!!errors.subject}>
                  <InputLabel id="subject-label" sx={{ fontSize: "1rem" }}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <SubjectIcon fontSize="medium" />
                      Subject
                    </Box>
                  </InputLabel>
                  <Select
                    labelId="subject-label"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    label={
                      <Box display="flex" alignItems="center" gap={1}>
                        <SubjectIcon fontSize="medium" />
                        Subject
                      </Box>
                    }
                    sx={{
                      fontSize: "1rem",
                      "& .MuiSelect-select": {
                        whiteSpace: "normal",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: "vertical",
                      },
                    }}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 400,
                          maxWidth: 500,
                        },
                      },
                    }}
                  >
                    <MenuItem value="" disabled sx={{ fontSize: "1rem" }}>
                      -- Select Subject --
                    </MenuItem>
                    {Object.entries(subjectsByCategory).map(
                      ([category, subjects]) => [
                        <MenuItem
                          key={category}
                          value={category}
                          disabled
                          sx={{
                            fontSize: "0.875rem",
                            fontWeight: "bold",
                            color: "text.primary",
                            backgroundColor: "grey.100",
                            "&.Mui-disabled": { opacity: 1 },
                          }}
                        >
                          {category}
                        </MenuItem>,
                        ...subjects.map((subject) => (
                          <MenuItem
                            key={subject}
                            value={subject}
                            sx={{
                              fontSize: "0.875rem",
                              pl: 4,
                            }}
                          >
                            {subject}
                          </MenuItem>
                        )),
                      ]
                    )}
                  </Select>
                  {errors.subject && (
                    <FormHelperText sx={{ fontSize: "0.875rem" }}>
                      {errors.subject}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>

              {/* File URL */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={
                    <Box display="flex" alignItems="center" gap={1}>
                      <LinkIcon fontSize="medium" />
                      <Typography variant="body1" fontWeight="500">
                        File URL
                      </Typography>
                    </Box>
                  }
                  name="fileUrl"
                  value={formData.fileUrl}
                  onChange={handleChange}
                  required
                  error={!!errors.fileUrl}
                  helperText={errors.fileUrl}
                  variant="outlined"
                  placeholder="https://example.com/file.pdf"
                  size="medium"
                  InputProps={{
                    style: { fontSize: "1rem" },
                    startAdornment: (
                      <InputAdornment position="start">
                        <LinkIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <Box display="flex" justifyContent="flex-end" mt={4}>
                  <PremiumButton
                    type="submit"
                    disabled={submitting}
                    startIcon={
                      submitting ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        <CloudUploadIcon />
                      )
                    }
                  >
                    {submitting ? "Submitting..." : "Upload Content"}
                  </PremiumButton>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </GlassPanel>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%", fontSize: "1rem" }}
          elevation={6}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ContentUpload;
