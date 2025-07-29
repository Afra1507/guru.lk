import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import SearchFilter from "../components/content/SearchFilter";
import ContentCard from "../components/content/ContentCard";

const Home = () => {
  // Sample data - will be replaced with API calls
  const featuredLessons = [
    {
      id: 1,
      title: "Basic Sinhala Grammar",
      description: "Introduction to Sinhala sentence structure",
      language: "Sinhala",
      subject: "Language",
      ageGroup: "All Ages",
      contentType: "video",
    },
    {
      id: 2,
      title: "Mathematics for Grade 10",
      description: "Algebra basics in Tamil",
      language: "Tamil",
      subject: "Mathematics",
      ageGroup: "15-17",
      contentType: "text",
    },
  ];

  return (
    <Container>
      <Row className="my-4">
        <Col>
          <h1>Welcome to GURU.Ik</h1>
          <p className="lead">
            Community Knowledge Sharing Platform for All Sri Lankans
          </p>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <SearchFilter />
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <h2>Featured Lessons</h2>
        </Col>
      </Row>

      <Row>
        {featuredLessons.map((lesson) => (
          <Col key={lesson.id} md={6} lg={4} className="mb-4">
            <ContentCard lesson={lesson} />
          </Col>
        ))}
      </Row>

      <Row className="mt-4">
        <Col className="text-center">
          <Button variant="primary" size="lg">
            Browse All Lessons
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
