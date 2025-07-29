import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Card,
  Button,
  Badge,
  Alert,
  Spinner,
  Form,
} from "react-bootstrap";
import { FaThumbsUp, FaReply, FaUser, FaArrowLeft } from "react-icons/fa";
import TimeAgo from "react-timeago";

const QuestionDetail = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [answerText, setAnswerText] = useState("");

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual API call
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Mock data - will be replaced with API response
        const mockQuestion = {
          id: id,
          title: "How to solve quadratic equations?",
          body: "I'm having trouble understanding how to solve quadratic equations using the formula method. Can someone explain step by step with an example?",
          user: "Student123",
          date: "2023-05-10T14:30:00Z",
          language: "English",
          subject: "Mathematics",
          likes: 8,
          isSolved: false,
        };

        const mockAnswers = [
          {
            id: 1,
            body: "Here's a step-by-step explanation with an example...",
            user: "MathTeacher",
            date: "2023-05-10T15:45:00Z",
            isAccepted: true,
            likes: 5,
          },
          {
            id: 2,
            body: "You can also try factoring method if the equation is factorable.",
            user: "Tutor456",
            date: "2023-05-11T09:20:00Z",
            isAccepted: false,
            likes: 2,
          },
        ];

        setQuestion(mockQuestion);
        setAnswers(mockAnswers);
        setLoading(false);
      } catch (err) {
        setError("Failed to load question. Please try again.");
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [id]);

  const handleLikeQuestion = () => {
    // TODO: Implement like functionality
    console.log("Liked question:", id);
  };

  const handleLikeAnswer = (answerId) => {
    // TODO: Implement like functionality
    console.log("Liked answer:", answerId);
  };

  const handleSubmitAnswer = (e) => {
    e.preventDefault();
    // TODO: Implement answer submission
    console.log("Answer submitted:", answerText);
    setAnswerText("");
  };

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
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

  if (!question) {
    return (
      <Container className="my-5">
        <Alert variant="warning">Question not found</Alert>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <Button
        variant="outline-secondary"
        className="mb-3"
        onClick={() => window.history.back()}
      >
        <FaArrowLeft className="me-1" /> Back to Questions
      </Button>

      <Card className="mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between mb-2">
            <div className="d-flex align-items-center">
              <FaUser className="me-2 text-muted" />
              <small className="text-muted">{question.user}</small>
            </div>
            <small className="text-muted">
              <TimeAgo date={question.date} />
            </small>
          </div>

          <Card.Title>{question.title}</Card.Title>
          <div className="mb-3">
            <Badge bg="info" className="me-2">
              {question.language}
            </Badge>
            <Badge bg="secondary">{question.subject}</Badge>
            {question.isSolved && (
              <Badge bg="success" className="ms-2">
                Solved
              </Badge>
            )}
          </div>

          <Card.Text>{question.body}</Card.Text>

          <Button variant="outline-primary" onClick={handleLikeQuestion}>
            <FaThumbsUp className="me-1" /> {question.likes}
          </Button>
        </Card.Body>
      </Card>

      <h4 className="mb-3">Answers ({answers.length})</h4>

      {answers.length === 0 ? (
        <Alert variant="info">No answers yet. Be the first to answer!</Alert>
      ) : (
        answers.map((answer) => (
          <Card
            key={answer.id}
            className={`mb-3 ${answer.isAccepted ? "border-success" : ""}`}
          >
            <Card.Body>
              <div className="d-flex justify-content-between mb-2">
                <div className="d-flex align-items-center">
                  <FaUser className="me-2 text-muted" />
                  <small className="text-muted">{answer.user}</small>
                </div>
                <small className="text-muted">
                  <TimeAgo date={answer.date} />
                </small>
              </div>

              <Card.Text>{answer.body}</Card.Text>

              <div className="d-flex justify-content-between align-items-center">
                <div>
                  {answer.isAccepted && (
                    <Badge bg="success" className="me-2">
                      Accepted Answer
                    </Badge>
                  )}
                </div>

                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => handleLikeAnswer(answer.id)}
                >
                  <FaThumbsUp className="me-1" /> {answer.likes}
                </Button>
              </div>
            </Card.Body>
          </Card>
        ))
      )}

      <Card className="mt-4">
        <Card.Body>
          <Card.Title>Post Your Answer</Card.Title>
          <Form onSubmit={handleSubmitAnswer}>
            <Form.Group className="mb-3">
              <Form.Control
                as="textarea"
                rows={5}
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                placeholder="Write your answer here..."
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              <FaReply className="me-1" /> Post Answer
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default QuestionDetail;
