import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Alert,
  Spinner,
} from "react-bootstrap";
import { FaDownload, FaThumbsUp, FaComment, FaArrowLeft } from "react-icons/fa";
import CommentSection from "./CommentSection";

const LessonViewer = () => {
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual API call
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Mock data - will be replaced with API response
        const mockLesson = {
          id: id,
          title: "Sample Lesson Title",
          description:
            "This is a detailed description of the lesson content. It explains what the lesson covers and its importance.",
          content:
            "Full lesson content in text format. This could be replaced with a video or audio player based on content type.",
          contentType: "text", // or 'video', 'audio'
          fileUrl: "https://example.com/lesson-file",
          subject: "Mathematics",
          language: "Sinhala",
          ageGroup: "15-17",
          uploader: "John Doe",
          uploadDate: "2023-05-15",
          likes: 24,
          downloads: 56,
          isDownloadable: true,
        };

        setLesson(mockLesson);
        setLoading(false);
      } catch (err) {
        setError("Failed to load lesson. Please try again.");
        setLoading(false);
      }
    };

    fetchLesson();
  }, [id]);

  const handleDownload = () => {
    // TODO: Implement download functionality
    console.log("Downloading lesson:", lesson.id);
  };

  const handleLike = () => {
    // TODO: Implement like functionality
    console.log("Liked lesson:", lesson.id);
  };

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!lesson) {
    return (
      <Container className="my-5">
        <Alert variant="warning">Lesson not found</Alert>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <Button
        variant="outline-secondary"
        className="mb-3"
        onClick={() => window.history.back()}
      >
        <FaArrowLeft className="me-1" /> Back to Lessons
      </Button>

      <Card className="mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between mb-2">
            <div>
              <Badge bg="info" className="me-2">
                {lesson.language}
              </Badge>
              <Badge bg="secondary">{lesson.subject}</Badge>
            </div>
            <small className="text-muted">
              Uploaded by {lesson.uploader} on {lesson.uploadDate}
            </small>
          </div>

          <Card.Title>{lesson.title}</Card.Title>
          <Card.Subtitle className="mb-3 text-muted">
            {lesson.ageGroup}
          </Card.Subtitle>

          <Card.Text className="mb-4">{lesson.description}</Card.Text>

          {/* Content display area - changes based on content type */}
          {lesson.contentType === "text" && (
            <div className="border p-3 mb-4 bg-light">{lesson.content}</div>
          )}

          {lesson.contentType === "video" && (
            <div className="ratio ratio-16x9 mb-4">
              <video controls>
                <source src={lesson.fileUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}

          {lesson.contentType === "audio" && (
            <div className="mb-4">
              <audio controls className="w-100">
                <source src={lesson.fileUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}

          <div className="d-flex justify-content-between align-items-center">
            <div>
              <Button
                variant="outline-primary"
                className="me-2"
                onClick={handleLike}
              >
                <FaThumbsUp className="me-1" /> {lesson.likes}
              </Button>
              <Button variant="outline-secondary">
                <FaComment className="me-1" /> Comment
              </Button>
            </div>

            {lesson.isDownloadable && (
              <Button variant="success" onClick={handleDownload}>
                <FaDownload className="me-1" /> Download
              </Button>
            )}
          </div>
        </Card.Body>
      </Card>

      <CommentSection comments={comments} lessonId={id} />
    </Container>
  );
};

export default LessonViewer;
