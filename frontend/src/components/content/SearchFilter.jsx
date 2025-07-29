import React, { useState } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";

const SearchFilter = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [language, setLanguage] = useState("all");
  const [subject, setSubject] = useState("all");
  const [ageGroup, setAgeGroup] = useState("all");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Will implement search functionality later
    console.log({ searchTerm, language, subject, ageGroup });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row className="g-2">
        <Col md={6}>
          <Form.Control
            type="text"
            placeholder="Search lessons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
        <Col md={2}>
          <Form.Select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="all">All Languages</option>
            <option value="sinhala">Sinhala</option>
            <option value="tamil">Tamil</option>
            <option value="english">English</option>
          </Form.Select>
        </Col>
        <Col md={2}>
          <Form.Select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          >
            <option value="all">All Subjects</option>
            <option value="math">Mathematics</option>
            <option value="science">Science</option>
            <option value="language">Language</option>
            <option value="history">History</option>
          </Form.Select>
        </Col>
        <Col md={2}>
          <Button variant="primary" type="submit" className="w-100">
            Search
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default SearchFilter;
