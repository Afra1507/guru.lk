import React from "react";
import { Card, Button, Badge } from "react-bootstrap";
import { FaDownload, FaPlay, FaBook } from "react-icons/fa";

const ContentCard = ({ lesson }) => {
  const getContentIcon = () => {
    switch (lesson.contentType) {
      case "video":
        return <FaPlay className="me-1" />;
      case "audio":
        return <FaPlay className="me-1" />;
      case "text":
        return <FaBook className="me-1" />;
      default:
        return <FaBook className="me-1" />;
    }
  };

  return (
    <Card className="h-100">
      <Card.Body>
        <div className="d-flex justify-content-between mb-2">
          <Badge bg="info">{lesson.language}</Badge>
          <Badge bg="secondary">{lesson.subject}</Badge>
        </div>
        <Card.Title>{lesson.title}</Card.Title>
        <Card.Text>{lesson.description}</Card.Text>
        <div className="d-flex justify-content-between align-items-center">
          <small className="text-muted">{lesson.ageGroup}</small>
          <div>
            {getContentIcon()}
            <Button variant="link" size="sm">
              <FaDownload />
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ContentCard;
