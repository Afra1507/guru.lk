import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import QuestionCard from "../components/forum/QuestionCard";
import { getQuestions } from "../services/forumService";

const QnA = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const data = await getQuestions();
        setQuestions(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load questions. Please try again.");
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

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
          <h1>Q&A Forum</h1>
        </Col>
        <Col className="text-end">
          <Button as={Link} to="/ask" variant="primary">
            Ask a Question
          </Button>
        </Col>
      </Row>

      <Row>
        <Col>
          {questions.length > 0 ? (
            questions.map((question) => (
              <QuestionCard key={question.id} question={question} />
            ))
          ) : (
            <Card>
              <Card.Body className="text-center">
                <p>No questions found. Be the first to ask!</p>
                <Button as={Link} to="/ask" variant="primary">
                  Ask a Question
                </Button>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default QnA;
