import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import contentService from "../../services/contentService";
import { jwtDecode } from "jwt-decode"; // fixed import

// Material UI Icons
import TitleIcon from "@mui/icons-material/Title";
import DescriptionIcon from "@mui/icons-material/Description";
import CategoryIcon from "@mui/icons-material/Category";
import LanguageIcon from "@mui/icons-material/Language";
import GroupIcon from "@mui/icons-material/Group";
import SubjectIcon from "@mui/icons-material/MenuBook";
import LinkIcon from "@mui/icons-material/Link";
import PersonIcon from "@mui/icons-material/Person";

import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

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

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success", // success, error, info, warning
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fileUrl) {
      setSnackbar({
        open: true,
        message: "Please provide a file URL.",
        severity: "warning",
      });
      return;
    }
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

  const LabelWithIcon = ({ icon, text }) => (
    <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
      {icon}
      {text}
    </span>
  );

  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "40px auto",
        padding: "0 15px",
      }}
    >
      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="formUserId">
            <Form.Label>
              <LabelWithIcon icon={<PersonIcon />} text="User ID" />
            </Form.Label>
            <Form.Control
              type="text"
              name="uploaderId"
              value={formData.uploaderId || ""}
              readOnly
              plaintext
            />
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group as={Col} controlId="formTitle">
            <Form.Label>
              <LabelWithIcon icon={<TitleIcon />} text="Title" />
            </Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group as={Col} controlId="formDescription">
            <Form.Label>
              <LabelWithIcon icon={<DescriptionIcon />} text="Description" />
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group as={Col} md={4} controlId="formContentType">
            <Form.Label>
              <LabelWithIcon icon={<CategoryIcon />} text="Content Type" />
            </Form.Label>
            <Form.Select
              name="contentType"
              value={formData.contentType}
              onChange={handleChange}
            >
              <option value="text">Text</option>
              <option value="video">Video</option>
              <option value="audio">Audio</option>
            </Form.Select>
          </Form.Group>

          <Form.Group as={Col} md={4} controlId="formLanguage">
            <Form.Label>
              <LabelWithIcon icon={<LanguageIcon />} text="Language" />
            </Form.Label>
            <Form.Select
              name="language"
              value={formData.language}
              onChange={handleChange}
            >
              <option value="sinhala">Sinhala</option>
              <option value="tamil">Tamil</option>
              <option value="english">English</option>
            </Form.Select>
          </Form.Group>

          <Form.Group as={Col} md={4} controlId="formAgeGroup">
            <Form.Label>
              <LabelWithIcon icon={<GroupIcon />} text="Age Group" />
            </Form.Label>
            <Form.Select
              name="ageGroup"
              value={formData.ageGroup}
              onChange={handleChange}
            >
              <option value="all">All Ages</option>
              <option value="primary">
                Primary School (5-10 years, Grades 1-5)
              </option>
              <option value="junior_secondary">
                Junior Secondary (10-13 years, Grades 6-9)
              </option>
              <option value="senior_secondary">
                Senior Secondary (14-16 years, Grades 10-11, GCE O-Level)
              </option>
              <option value="collegiate">
                Collegiate Level (16-18/19 years, GCE A-Level)
              </option>
              <option value="postgrad">Campus Postgraduates & Others</option>
            </Form.Select>
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group as={Col} controlId="formSubject">
            <Form.Label>
              <LabelWithIcon icon={<SubjectIcon />} text="Subject" />
            </Form.Label>
            <Form.Select
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                -- Select Subject --
              </option>
              {Object.entries(subjectsByCategory).map(
                ([category, subjects]) => (
                  <optgroup key={category} label={category}>
                    {subjects.map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </optgroup>
                )
              )}
            </Form.Select>
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group as={Col} controlId="formFileUrl">
            <Form.Label>
              <LabelWithIcon icon={<LinkIcon />} text="File URL" />
            </Form.Label>
            <Form.Control
              type="url"
              name="fileUrl"
              value={formData.fileUrl}
              onChange={handleChange}
              required
              placeholder="https://example.com/file.pdf"
            />
          </Form.Group>
        </Row>

        <Button variant="primary" type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit"}
        </Button>
      </Form>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
          elevation={6}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ContentUpload;
