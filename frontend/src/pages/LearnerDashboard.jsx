import React from "react";
import { Container, Row, Col, Tab, Tabs } from "react-bootstrap";
import ContentCard from "../components/content/ContentCard";

const LearnerDashboard = () => {
  // Sample data - will be replaced with API calls
  const recentLessons = [
    {
      id: 3,
      title: "History of Sri Lanka",
      description: "Ancient kingdoms and colonial periods",
      language: "English",
      subject: "History",
      ageGroup: "All Ages",
      contentType: "text",
    },
    {
      id: 4,
      title: "Basic Computer Skills",
      description: "Introduction to using computers",
      language: "Sinhala",
      subject: "Technology",
      ageGroup: "18+",
      contentType: "video",
    },
  ];

  const downloadedLessons = [
    {
      id: 1,
      title: "Basic Sinhala Grammar",
      description: "Introduction to Sinhala sentence structure",
      language: "Sinhala",
      subject: "Language",
      ageGroup: "All Ages",
      contentType: "video",
    },
  ];

  return (
    <Container className="my-4">
      <Row>
        <Col>
          <h2>Learner Dashboard</h2>
        </Col>
      </Row>

      <Tabs defaultActiveKey="recent" className="mb-3">
        <Tab eventKey="recent" title="Recent Lessons">
          <Row className="mt-3">
            {recentLessons.map((lesson) => (
              <Col key={lesson.id} md={6} lg={4} className="mb-4">
                <ContentCard lesson={lesson} />
              </Col>
            ))}
          </Row>
        </Tab>
        <Tab eventKey="downloads" title="My Downloads">
          <Row className="mt-3">
            {downloadedLessons.map((lesson) => (
              <Col key={lesson.id} md={6} lg={4} className="mb-4">
                <ContentCard lesson={lesson} />
              </Col>
            ))}
          </Row>
        </Tab>
        <Tab eventKey="questions" title="My Questions">
          <Row className="mt-3">
            <Col>
              <p>Your questions will appear here</p>
            </Col>
          </Row>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default LearnerDashboard;
