import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Spinner,
  Alert,
  Pagination,
} from "react-bootstrap";
import { fetchApprovedLessons } from "../services/contentService";
import ContentCard from "../components/content/ContentCard";
import SearchFilter from "../components/content/SearchFilter";

const Lessons = () => {
  const [lessons, setLessons] = useState([]);
  const [filteredLessons, setFilteredLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const lessonsPerPage = 9;

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        setLoading(true);
        const response = await fetchApprovedLessons();
        // Assuming API returns lessons array in response.data
        setLessons(response.data);
        setFilteredLessons(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load lessons. Please try again.");
        setLoading(false);
      }
    };

    fetchLessons();
  }, []);

  // Pagination calculation for filtered lessons
  const indexOfLastLesson = currentPage * lessonsPerPage;
  const indexOfFirstLesson = indexOfLastLesson - lessonsPerPage;
  const currentLessons = filteredLessons.slice(
    indexOfFirstLesson,
    indexOfLastLesson
  );
  const totalPages = Math.ceil(filteredLessons.length / lessonsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Filter handler passed to SearchFilter
  const handleFilter = ({ searchTerm, language, subject, ageGroup }) => {
    let tempLessons = [...lessons];

    // Filter by search term in title or description (case-insensitive)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      tempLessons = tempLessons.filter(
        (lesson) =>
          (lesson.title && lesson.title.toLowerCase().includes(term)) ||
          (lesson.description &&
            lesson.description.toLowerCase().includes(term))
      );
    }

    if (language && language !== "all") {
      tempLessons = tempLessons.filter(
        (lesson) => lesson.language?.toLowerCase() === language.toLowerCase()
      );
    }

    if (subject && subject !== "all" && subject.trim() !== "") {
      const subj = subject.toLowerCase();
      tempLessons = tempLessons.filter((lesson) =>
        lesson.subject?.toLowerCase().includes(subj)
      );
    }

    if (ageGroup && ageGroup !== "all") {
      tempLessons = tempLessons.filter(
        (lesson) => lesson.ageGroup?.toLowerCase() === ageGroup.toLowerCase()
      );
    }

    setFilteredLessons(tempLessons);
    setCurrentPage(1); // reset to first page when filter changes
  };

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" />
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

  return (
    <Container className="my-4">
      <Row className="mb-4">
        <Col>
          <h1>Browse Lessons</h1>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <SearchFilter onFilter={handleFilter} />
        </Col>
      </Row>

      <Row>
        {currentLessons.length > 0 ? (
          currentLessons.map((lesson) => (
            <Col key={lesson.id} md={6} lg={4} className="mb-4">
              <ContentCard lesson={lesson} />
            </Col>
          ))
        ) : (
          <Col>
            <Alert variant="info">
              No lessons found. Try adjusting your search filters.
            </Alert>
          </Col>
        )}
      </Row>

      {filteredLessons.length > lessonsPerPage && (
        <Row className="mt-4">
          <Col className="d-flex justify-content-center">
            <Pagination>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (number) => (
                  <Pagination.Item
                    key={number}
                    active={number === currentPage}
                    onClick={() => paginate(number)}
                  >
                    {number}
                  </Pagination.Item>
                )
              )}
            </Pagination>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Lessons;
