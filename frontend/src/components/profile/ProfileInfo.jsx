import React from "react";
import { Card, ListGroup, Button, Badge } from "react-bootstrap";
import {
  FaUserEdit,
  FaMapMarkerAlt,
  FaLanguage,
  FaUserShield,
} from "react-icons/fa";

const ProfileInfo = ({ user }) => {
  // Default user data - will be replaced with props from parent
  const defaultUser = {
    username: "john_doe",
    email: "john@example.com",
    role: "contributor",
    preferredLanguage: "sinhala",
    region: "Colombo",
    isLowIncome: false,
    joinDate: "2023-01-15",
    lastLogin: "2023-05-20T14:30:00Z",
  };

  const currentUser = user || defaultUser;

  const getRoleBadge = () => {
    switch (currentUser.role) {
      case "admin":
        return <Badge bg="danger">Admin</Badge>;
      case "contributor":
        return <Badge bg="success">Contributor</Badge>;
      default:
        return <Badge bg="primary">Learner</Badge>;
    }
  };

  const getLanguageName = (code) => {
    switch (code) {
      case "sinhala":
        return "සිංහල";
      case "tamil":
        return "தமிழ்";
      default:
        return "English";
    }
  };

  return (
    <Card className="mb-4">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <Card.Title className="mb-0">Profile Information</Card.Title>
          <Button variant="outline-primary" size="sm">
            <FaUserEdit className="me-1" /> Edit Profile
          </Button>
        </div>

        <ListGroup variant="flush">
          <ListGroup.Item className="d-flex justify-content-between align-items-center">
            <span>Username</span>
            <strong>{currentUser.username}</strong>
          </ListGroup.Item>

          <ListGroup.Item className="d-flex justify-content-between align-items-center">
            <span>Email</span>
            <strong>{currentUser.email}</strong>
          </ListGroup.Item>

          <ListGroup.Item className="d-flex justify-content-between align-items-center">
            <span>Account Type</span>
            {getRoleBadge()}
          </ListGroup.Item>

          <ListGroup.Item className="d-flex justify-content-between align-items-center">
            <span>
              <FaLanguage className="me-2" />
              Preferred Language
            </span>
            <strong>{getLanguageName(currentUser.preferredLanguage)}</strong>
          </ListGroup.Item>

          <ListGroup.Item className="d-flex justify-content-between align-items-center">
            <span>
              <FaMapMarkerAlt className="me-2" />
              Region
            </span>
            <strong>{currentUser.region || "Not specified"}</strong>
          </ListGroup.Item>

          <ListGroup.Item className="d-flex justify-content-between align-items-center">
            <span>
              <FaUserShield className="me-2" />
              Offline Access
            </span>
            <strong>{currentUser.isLowIncome ? "Enabled" : "Disabled"}</strong>
          </ListGroup.Item>

          <ListGroup.Item className="d-flex justify-content-between align-items-center">
            <span>Member Since</span>
            <strong>
              {new Date(currentUser.joinDate).toLocaleDateString()}
            </strong>
          </ListGroup.Item>

          <ListGroup.Item className="d-flex justify-content-between align-items-center">
            <span>Last Login</span>
            <strong>{new Date(currentUser.lastLogin).toLocaleString()}</strong>
          </ListGroup.Item>
        </ListGroup>
      </Card.Body>
    </Card>
  );
};

export default ProfileInfo;
