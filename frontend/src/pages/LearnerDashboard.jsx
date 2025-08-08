import React, { useState, useEffect } from "react";
import { Container, Row, Col, Tab, Tabs, Spinner } from "react-bootstrap";
import ContentCard from "../components/content/ContentCard";
import contentService from "../services/contentService";
import { jwtDecode } from "jwt-decode";

const LearnerDashboard = () => {
  const [recentLessons, setRecentLessons] = useState([]);
  const [downloadedLessons, setDownloadedLessons] = useState([]);
  const [loadingRecent, setLoadingRecent] = useState(true);
  const [loadingDownloads, setLoadingDownloads] = useState(true);

  // Get userId from token
  const getUserIdFromToken = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return undefined;
      const decoded = jwtDecode(token);
      return decoded?.id || decoded?.userId || decoded?.sub;
    } catch (e) {
      console.error("Failed to decode token", e);
      return undefined;
    }
  };

  useEffect(() => {
    const userId = getUserIdFromToken();
    if (!userId) {
      // Handle no user ID case
      setLoadingRecent(false);
      setLoadingDownloads(false);
      return;
    }

    // Fetch recent lessons (approved lessons)
    contentService
      .getApprovedLessons()
      .then((lessons) => {
        setRecentLessons(lessons);
      })
      .catch((err) => {
        console.error("Failed to load recent lessons", err);
      })
      .finally(() => setLoadingRecent(false));

    // Fetch user downloads and deduplicate lessons
    contentService
      .getUserDownloads(userId)
      .then((downloads) => {
        const lessonsFromDownloads = downloads.map((d) => d.lesson);

        // Deduplicate by lessonId or id
        const uniqueLessonsMap = new Map();
        lessonsFromDownloads.forEach((lesson) => {
          const id = lesson.lessonId || lesson.id;
          if (!uniqueLessonsMap.has(id)) {
            uniqueLessonsMap.set(id, lesson);
          }
        });
        const uniqueLessons = Array.from(uniqueLessonsMap.values());

        setDownloadedLessons(uniqueLessons);
      })
      .catch((err) => {
        console.error("Failed to load downloads", err);
      })
      .finally(() => setLoadingDownloads(false));
  }, []);

  return (
    <Container className="my-4">
      <Row>
        <Col>
          <h2>Learner Dashboard</h2>
        </Col>
      </Row>

      <Tabs defaultActiveKey="recent" className="mb-3" id="learner-tabs">
        <Tab eventKey="recent" title="Recent Lessons">
          <Row className="mt-3">
            {loadingRecent ? (
              <Spinner animation="border" />
            ) : recentLessons.length === 0 ? (
              <p>No recent lessons found.</p>
            ) : (
              recentLessons.map((lesson) => (
                <Col
                  key={lesson.lessonId || lesson.id}
                  md={6}
                  lg={4}
                  className="mb-4"
                >
                  <ContentCard lesson={lesson} />
                </Col>
              ))
            )}
          </Row>
        </Tab>

        <Tab eventKey="downloads" title="My Downloads">
          <Row className="mt-3">
            {loadingDownloads ? (
              <Spinner animation="border" />
            ) : downloadedLessons.length === 0 ? (
              <p>No downloads found.</p>
            ) : (
              downloadedLessons.map((lesson) => (
                <Col
                  key={lesson.lessonId || lesson.id}
                  md={6}
                  lg={4}
                  className="mb-4"
                >
                  <ContentCard lesson={lesson} />
                </Col>
              ))
            )}
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
