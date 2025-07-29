import React, { useState } from "react";
import { Form, Button, Card, Row, Col, Alert } from "react-bootstrap";
import { FaQuestionCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const QuestionForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    subject: "",
    language: "sinhala",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.body) {
      return setError("Please fill in all required fields");
    }

    setError("");
    setLoading(true);

    try {
      // TODO: Replace with actual API call
      console.log("Question data:", formData);
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // On successful submission, redirect to the question
      navigate("/qna/123"); // Will use actual ID from response
    } catch (err) {
      setError("Failed to post question. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="d-flex justify-content-center">
      <Card style={{ width: "800px" }} className="shadow my-4">
        <Card.Body>
          <h2 className="text-center mb-4">
            <FaQuestionCircle className="me-2" />
            Ask a Question
          </h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formTitle">
                <Form.Label>Question Title</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Be specific and imagine you're asking a question to another person"
                  required
                />
                <Form.Text className="text-muted">
                  Keep it concise and clear
                </Form.Text>
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col} controlId="formBody">
                <Form.Label>Detailed Question</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={6}
                  name="body"
                  value={formData.body}
                  onChange={handleChange}
                  placeholder="Include all the information someone would need to answer your question"
                  required
                />
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col} md={6} controlId="formSubject">
                <Form.Label>Subject</Form.Label>
                <Form.Control
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="e.g., Mathematics, Science"
                  required
                />
              </Form.Group>

              <Form.Group as={Col} md={6} controlId="formLanguage">
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
            </Row>

            <Button
              variant="primary"
              type="submit"
              className="w-100 mt-3"
              disabled={loading}
            >
              {loading ? "Posting Question..." : "Post Question"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default QuestionForm;
