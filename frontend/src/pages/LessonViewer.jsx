// D:\guru.lk\frontend\src\pages\LessonViewer.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Card,
  Button,
  Spinner,
  Alert,
  Badge,
} from "react-bootstrap";
import { FaDownload } from "react-icons/fa";
import { useContent } from "../hooks/useContent";
import { useAuth } from "../auth/useAuth";

const LessonViewer = () => {
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);
  const { getLessonById, incrementViewCount, createDownload, loading, error } =
    useContent();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const loadLesson = async () => {
      try {
        const data = await getLessonById(id);
        setLesson(data);
        await incrementViewCount(id);
      } catch (err) {
        console.error(err);
      }
    };
    loadLesson();
  }, [id, getLessonById, incrementViewCount]);

  const handleDownload = async () => {
    if (!isAuthenticated) {
      alert("Please login to download");
      return;
    }
    try {
      await createDownload(id);
      alert("Download registered successfully!");
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!lesson) return null;

  return (
    <Container className="my-4">
      <Card>
        <Card.Body>
          <Card.Title>{lesson.title}</Card.Title>
          <div className="mb-3">
            <Badge bg="info" className="me-2">
              {lesson.subject}
            </Badge>
            <Badge bg="secondary" className="me-2">
              {lesson.language}
            </Badge>
            <Badge bg="warning">{lesson.ageGroup}</Badge>
          </div>
          <Card.Text>{lesson.description}</Card.Text>
          <div className="d-flex justify-content-between align-items-center">
            <small className="text-muted">
              Views: {lesson.viewCount} | Uploaded:{" "}
              {new Date(lesson.createdAt).toLocaleDateString()}
            </small>
            <Button variant="success" onClick={handleDownload}>
              <FaDownload /> Download
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default LessonViewer;
