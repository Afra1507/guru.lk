// src/components/QuestionCard.jsx
import React from "react";
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const QuestionCard = ({ question }) => {
  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>{question.title}</Card.Title>
        <Card.Text>
          {question.body.length > 100
            ? question.body.slice(0, 100) + "..."
            : question.body}
        </Card.Text>
        <Card.Subtitle className="mb-2 text-muted">
          Asked by: {question.userId} on {new Date(question.createdAt).toLocaleDateString()}
        </Card.Subtitle>
        <Link to={`/questions/${question.questionId}`}>
          <Button variant="primary">View Details</Button>
        </Link>
      </Card.Body>
    </Card>
  );
};

export default QuestionCard;
