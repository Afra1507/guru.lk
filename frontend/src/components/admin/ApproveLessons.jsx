// src\components\admin\ApproveLessons.jsx
import React, { useEffect, useState } from "react";
import { Table, Button, Badge, Alert } from "react-bootstrap";
import { fetchPendingLessons, approveLesson } from "../../services/adminService";

const ApproveLessons = () => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPendingLessons = async () => {
      try {
        const { data } = await fetchPendingLessons();
        setLessons(data);
      } catch (err) {
        setError("Failed to load pending lessons");
      } finally {
        setLoading(false);
      }
    };
    loadPendingLessons();
  }, []);

  const handleApprove = async (lessonId) => {
    try {
      await approveLesson(lessonId);
      setLessons(lessons.filter((lesson) => lesson.lessonId !== lessonId));
    } catch (err) {
      setError("Approval failed");
    }
  };

  if (loading) return <Alert variant="info">Loading...</Alert>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="mt-4">
      <h4>Pending Lesson Approvals</h4>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Title</th>
            <th>Subject</th>
            <th>Uploader</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {lessons.map((lesson) => (
            <tr key={lesson.lessonId}>
              <td>{lesson.title}</td>
              <td>
                <Badge bg="secondary">{lesson.subject}</Badge>
              </td>
              <td>User #{lesson.uploaderId}</td>
              <td>
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => handleApprove(lesson.lessonId)}
                >
                  Approve
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ApproveLessons;
