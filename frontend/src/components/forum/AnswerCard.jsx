// src/components/AnswerCard.jsx
import React from "react";
import { Card } from "react-bootstrap";

const AnswerCard = ({ answer }) => {
  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Text>{answer.body}</Card.Text>
        <Card.Subtitle className="text-muted">
          Answered by: {answer.userId} on {new Date(answer.createdAt).toLocaleDateString()}
        </Card.Subtitle>
      </Card.Body>
    </Card>
  );
};

export default AnswerCard;
