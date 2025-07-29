import React from "react";
import { Card, Badge, Button } from "react-bootstrap";
import { FaComment, FaThumbsUp, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import TimeAgo from "react-timeago";

const QuestionCard = ({ question }) => {
  return (
    <Card className="mb-3">
      <Card.Body>
        <div className="d-flex justify-content-between mb-2">
          <div className="d-flex align-items-center">
            <FaUser className="me-2 text-muted" />
            <small className="text-muted">{question.user}</small>
          </div>
          <small className="text-muted">
            <TimeAgo date={question.date} />
          </small>
        </div>

        <Card.Title>
          <Link to={`/qna/${question.id}`} className="text-decoration-none">
            {question.title}
          </Link>
        </Card.Title>

        <Card.Text className="text-truncate">{question.body}</Card.Text>

        <div className="d-flex justify-content-between">
          <div>
            <Badge bg="info" className="me-2">
              {question.language}
            </Badge>
            <Badge bg="secondary">{question.subject}</Badge>
          </div>

          <div>
            <Button variant="outline-primary" size="sm" className="me-2">
              <FaThumbsUp className="me-1" /> {question.likes}
            </Button>
            <Button variant="outline-secondary" size="sm">
              <FaComment className="me-1" /> {question.answers}
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

QuestionCard.defaultProps = {
  question: {
    id: 1,
    title: "Sample Question Title",
    body: "This is the body of the question that explains what the user is asking about.",
    user: "Anonymous",
    date: new Date().toISOString(),
    language: "Sinhala",
    subject: "Mathematics",
    likes: 5,
    answers: 3,
  },
};

export default QuestionCard;
