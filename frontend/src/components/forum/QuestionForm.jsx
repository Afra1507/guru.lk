import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import * as communityService from "../../services/communityService";
import { getUserIdFromToken } from "../../utils/authUtils";

const QuestionForm = ({ onQuestionCreated }) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [language, setLanguage] = useState("english"); // default lowercase language
  const [error, setError] = useState(null);
  const userId = getUserIdFromToken();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      setError("You must be logged in to ask a question.");
      return;
    }
    if (!language) {
      setError("Please select a language.");
      return;
    }
    try {
      setError(null);
      // Ensure language is lowercase before sending
      const questionData = { title, body, language: language.toLowerCase() };
      const res = await communityService.createQuestion(userId, questionData);
      onQuestionCreated(res.data);
      setTitle("");
      setBody("");
      setLanguage("english");
    } catch {
      setError("Failed to create question. Try again.");
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="mb-4">
      {error && <Alert variant="danger">{error}</Alert>}

      <Form.Group controlId="questionTitle" className="mb-3">
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter question title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group controlId="questionBody" className="mb-3">
        <Form.Label>Body</Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          placeholder="Describe your question"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group controlId="questionLanguage" className="mb-3">
        <Form.Label>Language</Form.Label>
        <Form.Select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          required
        >
          <option value="sinhala">SINHALA</option>
          <option value="tamil">TAMIL</option>
          <option value="english">ENGLISH</option>
        </Form.Select>
      </Form.Group>

      <Button variant="primary" type="submit">
        Ask Question
      </Button>
    </Form>
  );
};

export default QuestionForm;
