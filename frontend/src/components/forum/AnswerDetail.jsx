// src/components/AnswerDetail.jsx
import React from "react";

const AnswerDetail = ({ answer }) => {
  return (
    <div>
      <h5>Answer by {answer.userId}</h5>
      <p>{answer.body}</p>
      <small>Created: {new Date(answer.createdAt).toLocaleString()}</small>
      {/* Add buttons for edit, accept, vote, etc, based on roles */}
    </div>
  );
};

export default AnswerDetail;
