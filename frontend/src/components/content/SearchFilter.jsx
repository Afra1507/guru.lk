// src/components/content/SearchFilter.jsx

import React, { useState } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";

const SearchFilter = ({ onFilter }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [language, setLanguage] = useState("all");
  const [subject, setSubject] = useState("all");
  const [ageGroup, setAgeGroup] = useState("all");

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter({
      searchTerm: searchTerm.trim(),
      language,
      subject,
      ageGroup,
    });
  };

  const handleReset = () => {
    setSearchTerm("");
    setLanguage("all");
    setSubject("all");
    setAgeGroup("all");
    onFilter({
      searchTerm: "",
      language: "all",
      subject: "all",
      ageGroup: "all",
    });
  };

  return (
    <Form onSubmit={handleSubmit} className="mb-3">
      <Row className="g-2">
        <Col md={4}>
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

        <Col md={3}>
          <Form.Control
            type="text"
            placeholder="Subject"
            value={subject === "all" ? "" : subject}
            onChange={(e) => setSubject(e.target.value.trim() || "all")}
          />
        </Col>

        <Col md={3}>
          <Form.Select
            value={ageGroup}
            onChange={(e) => setAgeGroup(e.target.value)}
          >
            <option value="all">All Ages</option>
            <option value="5-10">5-10</option>
            <option value="11-14">11-14</option>
            <option value="15-17">15-17</option>
            <option value="18+">18+</option>
          </Form.Select>
        </Col>
      </Row>

      <Row className="mt-2">
        <Col md={6}>
          <Button type="submit" variant="primary" className="w-100">
            Filter
          </Button>
        </Col>
        <Col md={6}>
          <Button
            variant="outline-secondary"
            className="w-100"
            onClick={handleReset}
          >
            Reset Filters
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default SearchFilter;
