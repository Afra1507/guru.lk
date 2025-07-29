import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import {
  FaBook,
  FaDownload,
  FaQuestionCircle,
  FaReply,
  FaThumbsUp,
  FaStar,
} from "react-icons/fa";

const ProfileStats = ({ stats }) => {
  // Default stats - will be replaced with props from parent
  const defaultStats = {
    lessonsUploaded: 12,
    lessonsDownloaded: 24,
    questionsAsked: 5,
    answersProvided: 18,
    likesReceived: 42,
    reputationScore: 156,
  };

  const currentStats = stats || defaultStats;

  const statCards = [
    {
      title: "Lessons Uploaded",
      value: currentStats.lessonsUploaded,
      icon: <FaBook size={24} />,
      color: "primary",
    },
    {
      title: "Lessons Downloaded",
      value: currentStats.lessonsDownloaded,
      icon: <FaDownload size={24} />,
      color: "success",
    },
    {
      title: "Questions Asked",
      value: currentStats.questionsAsked,
      icon: <FaQuestionCircle size={24} />,
      color: "info",
    },
    {
      title: "Answers Provided",
      value: currentStats.answersProvided,
      icon: <FaReply size={24} />,
      color: "warning",
    },
    {
      title: "Likes Received",
      value: currentStats.likesReceived,
      icon: <FaThumbsUp size={24} />,
      color: "danger",
    },
    {
      title: "Reputation Score",
      value: currentStats.reputationScore,
      icon: <FaStar size={24} />,
      color: "secondary",
    },
  ];

  return (
    <Row className="g-4 mb-4">
      {statCards.map((stat, index) => (
        <Col key={index} md={4} lg={2}>
          <Card className={`text-white bg-${stat.color} h-100`}>
            <Card.Body className="d-flex flex-column align-items-center">
              <div className="mb-2">{stat.icon}</div>
              <Card.Title className="mb-0 text-center">{stat.value}</Card.Title>
              <Card.Text className="text-center">{stat.title}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default ProfileStats;
