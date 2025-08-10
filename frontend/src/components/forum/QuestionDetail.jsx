// src/components/QuestionDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as communityService from "../../services/communityService";
import AnswerCard from "./AnswerCard";
import AnswerForm from "./AnswerForm";
import { getUserIdFromToken } from "../../utils/authUtils";
import { Spinner, Alert } from "react-bootstrap";

const QuestionDetail = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = getUserIdFromToken();

  useEffect(() => {
    const fetchQuestionAndAnswers = async () => {
      try {
        setLoading(true);
        const questionRes = await communityService.getQuestion(id);
        const answersRes = await communityService.getAnswersByQuestionId(id);
        setQuestion(questionRes.data);
        setAnswers(answersRes.data);
      } catch (err) {
        setError("Failed to load question or answers.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuestionAndAnswers();
  }, [id]);

  const addAnswer = (newAnswer) => {
    setAnswers((prev) => [newAnswer, ...prev]);
  };

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!question) return <p>No question found</p>;

  return (
    <div>
      <h2>{question.title}</h2>
      <p>{question.body}</p>
      <small>Asked by: {question.userId}</small>
      <hr />
      <h3>Answers</h3>
      {answers.length === 0 && <p>No answers yet. Be the first to answer!</p>}
      {answers.map((answer) => (
        <AnswerCard key={answer.answerId} answer={answer} />
      ))}
      {userId ? (
        <AnswerForm questionId={question.questionId} addAnswer={addAnswer} />
      ) : (
        <p>Please log in to post an answer.</p>
      )}
    </div>
  );
};

export default QuestionDetail;
