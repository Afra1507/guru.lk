// src/pages/Lessons.jsx

import React, { useEffect, useState } from "react";
import { Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import ContentCard from "../components/content/ContentCard";
import SearchFilter from "../components/content/SearchFilter";
import { useContent } from "../hooks/useContent";

const Lessons = () => {
  const [lessons, setLessons] = useState([]);
  const [filteredLessons, setFilteredLessons] = useState([]);
  const { getApprovedLessons, createDownload, loading, error } = useContent();

  useEffect(() => {
    const loadLessons = async () => {
      try {
        const data = await getApprovedLessons();
        if (!Array.isArray(data)) {
          console.error("Expected array but received:", typeof data, data);
          throw new Error("Invalid data format received from server");
        }

        setLessons(data);
        setFilteredLessons(data);
      } catch (err) {
        console.error("Failed to load lessons:", err);
        setLessons([]);
        setFilteredLessons([]);
      }
    };

    loadLessons();
  }, [getApprovedLessons]);

  const handleFilter = ({ searchTerm, language, subject, ageGroup }) => {
    let filtered = [...lessons];

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (lesson) =>
          lesson.title.toLowerCase().includes(lower) ||
          lesson.description.toLowerCase().includes(lower) ||
          lesson.subject.toLowerCase().includes(lower)
      );
    }

    if (language !== "all") {
      filtered = filtered.filter(
        (lesson) => lesson.language.toLowerCase() === language.toLowerCase()
      );
    }

    if (subject !== "all") {
      filtered = filtered.filter(
        (lesson) => lesson.subject.toLowerCase() === subject.toLowerCase()
      );
    }

    if (ageGroup !== "all") {
      filtered = filtered.filter(
        (lesson) => lesson.ageGroup.toLowerCase() === ageGroup.toLowerCase()
      );
    }

    setFilteredLessons(filtered);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <Container className="my-4">
        <Alert variant="danger">
          Error loading lessons: {error.toString()}
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <h2 className="mb-4">Available Lessons</h2>

      {/* Updated to use the new filter handler */}
      <SearchFilter onFilter={handleFilter} />

      <Row className="mt-3 g-4">
        {filteredLessons.length > 0 ? (
          filteredLessons.map((lesson) => (
            <Col key={lesson.lessonId} xs={12} md={6} lg={4}>
              <ContentCard lesson={lesson} createDownload={createDownload} />
            </Col>
          ))
        ) : (
          <Col>
            <Alert variant="info" className="text-center">
              {lessons.length === 0
                ? "No lessons available"
                : "No lessons match your filter criteria"}
            </Alert>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default Lessons;
