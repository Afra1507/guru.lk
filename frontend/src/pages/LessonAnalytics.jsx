import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { useContent } from "../hooks/useContent";
import LoadingSpinner from "../components/ui/LoadingSpinner";

const LessonAnalytics = () => {
  const { getContentAnalytics, loading } = useContent();
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    getContentAnalytics().then(setAnalytics).catch(console.error);
  }, [getContentAnalytics]);

  if (loading) return <LoadingSpinner />;
  if (!analytics) return <p>No analytics data found.</p>;

  // Helper to render top viewed lessons
  const renderTopViewed = (lessons) => {
    return (
      <div className="mt-4">
        <h4 className="mb-3">Top Viewed Lessons</h4>
        <Row className="g-4">
          {lessons.map((lesson) => (
            <Col key={lesson.lessonId} xs={12} md={6} lg={4}>
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Title>{lesson.title}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    Views: {lesson.viewCount}
                  </Card.Subtitle>
                  <Card.Text>
                    {lesson.description}
                    <br />
                    <strong>Subject:</strong> {lesson.subject}
                    <br />
                    <strong>Type:</strong> {lesson.contentType}
                    <br />
                    <strong>Language:</strong> {lesson.language}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    );
  };

  return (
    <Container className="my-4">
      <h2 className="mb-4">Content Analytics</h2>
      <Row className="g-4">
        {Object.entries(analytics).map(([key, value]) => {
          if (Array.isArray(value) && key.toLowerCase().includes("top")) {
            // Handle top viewed or similar lesson arrays
            return (
              <Col key={key} xs={12}>
                {renderTopViewed(value)}
              </Col>
            );
          }

          // Handle numbers or strings
          return (
            <Col key={key} xs={12} md={6} lg={3}>
              <Card className="text-center shadow-sm">
                <Card.Body>
                  <Card.Title className="text-capitalize">
                    {key.replace(/([A-Z])/g, " $1")}
                  </Card.Title>
                  <Card.Text className="fs-3 fw-bold">{value}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
};

export default LessonAnalytics;
