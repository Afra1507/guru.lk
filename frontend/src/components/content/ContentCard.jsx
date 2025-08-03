import React from "react";
import { Card, Button, Badge } from "react-bootstrap";
import { FaDownload, FaPlay, FaBook } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  incrementLessonView,
  createDownload,
} from "../../services/contentService";
import { useAuth } from "../../auth/useAuth"; // assumed

const ContentCard = ({ lesson }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleView = async () => {
    await incrementLessonView(lesson.lessonId);
    navigate(`/lessons/${lesson.lessonId}`);
  };

  const handleDownload = async () => {
    try {
      await createDownload(user.id, lesson.lessonId);
      alert("Download registered!");
    } catch (err) {
      alert("Download failed.");
    }
  };

  const getContentIcon = () => {
    switch (lesson.contentType) {
      case "video":
      case "audio":
        return <FaPlay className="me-1" />;
      case "text":
      default:
        return <FaBook className="me-1" />;
    }
  };

  return (
    <Card className="h-100">
      <Card.Body onClick={handleView} style={{ cursor: "pointer" }}>
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
            <Button
              variant="link"
              size="sm"
              onClick={(e) => {
                e.stopPropagation(); // Prevent navigating when downloading
                handleDownload();
              }}
            >
              <FaDownload />
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ContentCard;
