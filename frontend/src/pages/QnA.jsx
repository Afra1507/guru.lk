import React, { useEffect, useState } from "react";
import * as communityService from "../services/communityService";
import QuestionCard from "../components/forum/QuestionCard";
import QuestionForm from "../components/forum/QuestionForm";
import { Container, Spinner, Alert } from "react-bootstrap";

const QnAPage = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const res = await communityService.getAllQuestions();
        setQuestions(res.data);
      } catch (err) {
        setError("Failed to load questions.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleQuestionCreated = (newQuestion) => {
    // Add new question to top of list
    setQuestions((prev) => [newQuestion, ...prev]);
  };

  if (loading) return <Spinner animation="border" />;

  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container>
      <h1 className="my-4">Community Questions</h1>

      <QuestionForm onQuestionCreated={handleQuestionCreated} />

      {questions.length === 0 ? (
        <p>No questions yet. Be the first to ask!</p>
      ) : (
        questions.map((q) => <QuestionCard key={q.questionId} question={q} />)
      )}
    </Container>
  );
};

export default QnAPage;
