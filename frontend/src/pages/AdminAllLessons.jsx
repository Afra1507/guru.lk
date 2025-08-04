import React, { useEffect, useState } from "react";
import { Container, Row, Col, Alert } from "react-bootstrap";
import { useContent } from "../hooks/useContent";
import ContentCard from "../components/content/ContentCard";

const AdminAllLessons = () => {
  const { getAllLessons } = useContent();
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    getAllLessons().then(setLessons).catch(console.error);
  }, []);

  return (
    <Container className="my-4">
      <h2>All Lessons (Admin View)</h2>
      <Row className="mt-3 g-4">
        {lessons.length === 0 ? (
          <Col>
            <Alert variant="info">No lessons available.</Alert>
          </Col>
        ) : (
          lessons.map((lesson) => (
            <Col key={lesson.lessonId} xs={12} md={6} lg={4}>
              <ContentCard lesson={lesson} />
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
};

export default AdminAllLessons;
