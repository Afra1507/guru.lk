import React, { useState, useEffect } from "react";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import ContentCard from "../components/content/ContentCard";
import contentService from "../services/contentService";
import jwtDecode from "jwt-decode";

const DownloadsPage = () => {
  const [downloadedLessons, setDownloadedLessons] = useState([]);
  const [loadingDownloads, setLoadingDownloads] = useState(true);

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
      setLoadingDownloads(false);
      return;
    }

    contentService
      .getUserDownloads(userId)
      .then((downloads) => {
        const lessonsFromDownloads = downloads.map((d) => d.lesson);

        // Deduplicate lessons by id or lessonId
        const uniqueLessonsMap = new Map();
        lessonsFromDownloads.forEach((lesson) => {
          const id = lesson.lessonId || lesson.id;
          if (!uniqueLessonsMap.has(id)) {
            uniqueLessonsMap.set(id, lesson);
          }
        });
        setDownloadedLessons(Array.from(uniqueLessonsMap.values()));
      })
      .catch((err) => {
        console.error("Failed to load downloads", err);
      })
      .finally(() => setLoadingDownloads(false));
  }, []);

  return (
    <Container className="my-4">
      <h2>My Downloads</h2>
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
    </Container>
  );
};

export default DownloadsPage;
