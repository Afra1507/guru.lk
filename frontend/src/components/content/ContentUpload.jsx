// D:\guru.lk\frontend\src\components\content\ContentUpload.jsx
import React, { useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import contentService from "../../services/contentService"; // ✅ Corrected import

const ContentUpload = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    contentType: "text",
    subject: "",
    language: "sinhala",
    ageGroup: "all",
    file: null,
  });

  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, file: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.file) {
      alert("Please upload a file.");
      return;
    }

    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }

    try {
      setUploading(true);
      await contentService.createLesson(data);
      alert("Lesson uploaded successfully! Awaiting approval.");
      setFormData({
        title: "",
        description: "",
        contentType: "text",
        subject: "",
        language: "sinhala",
        ageGroup: "all",
        file: null,
      });
    } catch (err) {
      alert("Upload failed: " + (err.response?.data?.message || err.message));
    } finally {
      setUploading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
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

      <Row className="mb-3">
        <Form.Group as={Col} controlId="formFile">
          <Form.Label>Upload File</Form.Label>
          <Form.Control
            type="file"
            onChange={handleFileChange}
            required
            accept="video/*,audio/*,text/*"
          />
        </Form.Group>
      </Row>

      <Button variant="primary" type="submit" disabled={uploading}>
        {uploading ? "Uploading..." : "Upload Lesson"}
      </Button>
    </Form>
  );
};

export default ContentUpload;
