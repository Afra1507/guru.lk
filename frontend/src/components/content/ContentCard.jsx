// src/components/content/ContentCard.jsx

import React, { useState } from "react";
import { Card, Button, Badge } from "react-bootstrap";
import { FaDownload } from "react-icons/fa";
import { useAuth } from "../../auth/useAuth";
import { useNavigate } from "react-router-dom";

const ContentCard = ({ lesson, createDownload }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      alert("Please login to download");
      return;
    }
    try {
      setIsDownloading(true);
      await createDownload(lesson.lessonId);
      alert("Download registered!");
    } catch (err) {
      alert(err.message);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleView = () => {
    navigate(`/lessons/${lesson.lessonId}`);
  };

  return (
    <Card onClick={handleView} style={{ cursor: "pointer" }}>
      <Card.Body>
        <Card.Title>{lesson.title}</Card.Title>
        <Card.Text>{lesson.description}</Card.Text>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <Badge bg="info" className="me-2">
              {lesson.subject}
            </Badge>
            <Badge bg="secondary">{lesson.language}</Badge>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={handleDownload}
            disabled={isDownloading}
          >
            <FaDownload /> {isDownloading ? "Processing..." : "Download"}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ContentCard;
