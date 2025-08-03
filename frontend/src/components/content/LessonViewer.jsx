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
import {
  fetchLessonById,
  incrementLessonView,
  createDownload,
} from "../../services/contentService";
import { useAuth } from "../../auth/useAuth"; // assumed auth hook

const LessonViewer = () => {
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [comments, setComments] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const loadLesson = async () => {
      try {
        setLoading(true);
        const response = await fetchLessonById(id);
        setLesson(response.data);
        setLoading(false);
        await incrementLessonView(id);
      } catch (err) {
        setError("Failed to load lesson. Please try again.");
        setLoading(false);
      }
    };

    loadLesson();
  }, [id]);

  const handleDownload = async () => {
    if (!user) {
      alert("Please login to download.");
      return;
    }
    try {
      await createDownload(user.id, lesson.lessonId || lesson.id);
      alert("Download registered. The file will start downloading.");
      // Optionally trigger actual file download:
      window.open(lesson.fileUrl, "_blank");
    } catch (err) {
      alert("Download failed. Please try again.");
    }
  };

  const handleLike = () => {
    // Optional: implement liking logic here
    alert("Liked!");
  };

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" role="status" />
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
                <FaThumbsUp className="me-1" /> {lesson.likes || 0}
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
