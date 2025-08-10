// src/components/AnswerForm.jsx
import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import * as communityService from "../../services/communityService";
import { getUserIdFromToken } from "../../utils/authUtils";

const AnswerForm = ({ questionId, addAnswer }) => {
  const [body, setBody] = useState("");
  const [error, setError] = useState(null);
  const userId = getUserIdFromToken();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      setError("You must be logged in to answer.");
      return;
    }
    try {
      setError(null);
      const answerData = { questionId, body };
      const res = await communityService.createAnswer(userId, answerData);
      addAnswer(res.data);
      setBody("");
    } catch {
      setError("Failed to post answer. Try again.");
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="mt-4">
      {error && <Alert variant="danger">{error}</Alert>}
      <Form.Group controlId="answerBody" className="mb-3">
        <Form.Label>Your Answer</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Write your answer here"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
        />
      </Form.Group>
      <Button variant="success" type="submit">
        Submit Answer
      </Button>
    </Form>
  );
};

export default AnswerForm;
