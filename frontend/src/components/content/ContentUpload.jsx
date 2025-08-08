import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import contentService from "../../services/contentService";
import { jwtDecode } from "jwt-decode";

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

  useEffect(() => {
    // Get token from wherever you store it, e.g. localStorage
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
      alert("Please provide a file URL.");
      return;
    }
    if (!formData.uploaderId) {
      alert("User not authenticated.");
      return;
    }

    try {
      setSubmitting(true);
      await contentService.createLesson(formData); // Send the formData directly
      alert("Lesson created successfully!");
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
      alert(
        "Submission failed: " + (err.response?.data?.message || err.message)
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {/* User ID (read-only) */}
      <Row className="mb-3">
        <Form.Group as={Col} controlId="formUserId">
          <Form.Label>User ID</Form.Label>
          <Form.Control
            type="text"
            name="uploaderId"
            value={formData.uploaderId || ""}
            readOnly
            plaintext
          />
        </Form.Group>
      </Row>

      {/* Title */}
      <Row className="mb-3">
        <Form.Group as={Col} controlId="formTitle">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </Form.Group>
      </Row>

      {/* Description */}
      <Row className="mb-3">
        <Form.Group as={Col} controlId="formDescription">
          <Form.Label>Description</Form.Label>
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

      {/* Content Type, Language, Age Group */}
      <Row className="mb-3">
        <Form.Group as={Col} md={4} controlId="formContentType">
          <Form.Label>Content Type</Form.Label>
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
          <Form.Label>Language</Form.Label>
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
          <Form.Label>Age Group</Form.Label>
          <Form.Select
            name="ageGroup"
            value={formData.ageGroup}
            onChange={handleChange}
          >
            <option value="all">All Ages</option>
            <option value="5-10">5-10</option>
            <option value="11-14">11-14</option>
            <option value="15-17">15-17</option>
            <option value="18+">18+</option>
          </Form.Select>
        </Form.Group>
      </Row>

      {/* Subject */}
      <Row className="mb-3">
        <Form.Group as={Col} controlId="formSubject">
          <Form.Label>Subject</Form.Label>
          <Form.Control
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
          />
        </Form.Group>
      </Row>

      {/*File Upload with URL Input */}
      <Row className="mb-3">
        <Form.Group as={Col} controlId="formFileUrl">
          <Form.Label>File URL</Form.Label>
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
  );
};

export default ContentUpload;
