import React, { useState } from "react";
import { Card, ListGroup, Button, Badge, Form, Modal } from "react-bootstrap";
import {
  FaUserEdit,
  FaLanguage,
  FaMapMarkerAlt,
  FaUserShield,
  FaTools,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ProfileInfo = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [showEdit, setShowEdit] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...user });

  if (!user) return null;

  const role = user.role?.toUpperCase();

  const getRoleBadge = () => {
    switch (role) {
      case "ADMIN":
        return <Badge bg="danger">Admin</Badge>;
      case "CONTRIBUTOR":
        return <Badge bg="success">Contributor</Badge>;
      default:
        return <Badge bg="primary">Learner</Badge>;
    }
  };

  const getLanguageDisplayName = (code) => {
    if (!code) return "Not specified";
    switch (code.toUpperCase()) {
      case "SINHALA":
        return "සිංහල";
      case "TAMIL":
        return "தமிழ்";
      case "ENGLISH":
      default:
        return "English";
    }
  };

  const handleSaveChanges = async () => {
    try {
      // PUT /user/profile expects UpdateProfileRequest
      const payload = {
        email: editedUser.email,
        preferredLanguage: editedUser.preferredLanguage,
        region: editedUser.region,
        isLowIncome: editedUser.isLowIncome,
      };

      const res = await axios.put("/user/profile", payload);
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
      setShowEdit(false);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update profile.");
    }
  };

  return (
    <>
      <Card className="mb-4 profile-card">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <Card.Title className="mb-0">Profile Information</Card.Title>
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => setShowEdit(true)}
            >
              <FaUserEdit className="me-1" /> Edit Profile
            </Button>
          </div>

          <ListGroup variant="flush">
            <ListGroup.Item className="d-flex justify-content-between">
              <span>Username</span>
              <strong>{user.username}</strong>
            </ListGroup.Item>

            <ListGroup.Item className="d-flex justify-content-between">
              <span>Email</span>
              <strong>{user.email || "Not specified"}</strong>
            </ListGroup.Item>

            <ListGroup.Item className="d-flex justify-content-between">
              <span>Account Type</span>
              {getRoleBadge()}
            </ListGroup.Item>

            {role !== "ADMIN" && (
              <>
                <ListGroup.Item className="d-flex justify-content-between align-items-center">
                  <span>
                    <FaLanguage className="me-2" />
                    Preferred Language
                  </span>
                  <strong>
                    {getLanguageDisplayName(user.preferredLanguage)}
                  </strong>
                </ListGroup.Item>

                <ListGroup.Item className="d-flex justify-content-between align-items-center">
                  <span>
                    <FaMapMarkerAlt className="me-2" />
                    Region
                  </span>
                  <strong>{user.region || "Not specified"}</strong>
                </ListGroup.Item>

                <ListGroup.Item className="d-flex justify-content-between align-items-center">
                  <span>
                    <FaUserShield className="me-2" />
                    Low Income
                  </span>
                  <strong>{user.isLowIncome ? "Yes" : "No"}</strong>
                </ListGroup.Item>
              </>
            )}

            {role === "ADMIN" && (
              <ListGroup.Item>
                <Button
                  variant="warning"
                  className="w-100"
                  onClick={() => navigate("/admin/users")}
                >
                  <FaTools className="me-2" /> Go to User Management
                </Button>
              </ListGroup.Item>
            )}
          </ListGroup>
        </Card.Body>
      </Card>

      {/* Edit Modal */}
      <Modal show={showEdit} onHide={() => setShowEdit(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="emailInput">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={editedUser.email || ""}
                onChange={(e) =>
                  setEditedUser({ ...editedUser, email: e.target.value })
                }
              />
            </Form.Group>

            {role !== "ADMIN" && (
              <>
                <Form.Group className="mb-3" controlId="languageSelect">
                  <Form.Label>Preferred Language</Form.Label>
                  <Form.Select
                    value={editedUser.preferredLanguage || "ENGLISH"}
                    onChange={(e) =>
                      setEditedUser({
                        ...editedUser,
                        preferredLanguage: e.target.value.toUpperCase(),
                      })
                    }
                  >
                    <option value="ENGLISH">English</option>
                    <option value="SINHALA">සිංහල</option>
                    <option value="TAMIL">தமிழ்</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3" controlId="regionInput">
                  <Form.Label>Region</Form.Label>
                  <Form.Control
                    type="text"
                    maxLength={100}
                    value={editedUser.region || ""}
                    onChange={(e) =>
                      setEditedUser({ ...editedUser, region: e.target.value })
                    }
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="lowIncomeCheckbox">
                  <Form.Check
                    type="checkbox"
                    label="Low Income"
                    checked={!!editedUser.isLowIncome}
                    onChange={(e) =>
                      setEditedUser({
                        ...editedUser,
                        isLowIncome: e.target.checked,
                      })
                    }
                  />
                </Form.Group>
              </>
            )}
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEdit(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ProfileInfo;
