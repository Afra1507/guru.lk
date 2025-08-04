import React, { useEffect, useState } from "react";
import { Button, Card, Spinner, Row, Col } from "react-bootstrap";
import { useContent } from "../hooks/useContent";

const PendingLessons = () => {
  const { getPendingLessons, approveLesson, loading, error } = useContent();

  const [pending, setPending] = useState([]);

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const lessons = await getPendingLessons();
        setPending(lessons);
      } catch (e) {
        console.error("Failed to fetch pending lessons", e);
      }
    };

    fetchPending();
  }, [getPendingLessons]);

  const handleApprove = async (id) => {
    try {
      await approveLesson(id);
      setPending((prev) => prev.filter((lesson) => lesson.lessonId !== id));
    } catch (err) {
      alert("Failed to approve lesson: " + err);
    }
  };

  if (loading) return <Spinner animation="border" />;

  if (error) return <p className="text-danger">{error}</p>;

  if (pending.length === 0) return <p>No pending lessons found.</p>;

  return (
    <Row>
      {pending.map((lesson) => (
        <Col md={6} lg={4} key={lesson.lessonId} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>{lesson.title}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                Uploaded by User ID: {lesson.uploaderId}
              </Card.Subtitle>
              <Card.Text>{lesson.description?.slice(0, 100)}...</Card.Text>

              <Button
                variant="success"
                size="sm"
                onClick={() => handleApprove(lesson.lessonId)}
              >
                Approve
              </Button>
              {/* Optional Reject or View buttons */}
              {/* <Button variant="outline-danger" size="sm" className="ms-2">Reject</Button> */}
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default PendingLessons;
