// auth/Register.jsx
import React, { useState } from "react";
import { Form, Button, Card, Alert, Col, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FaUserPlus } from "react-icons/fa";
import { registerUser } from "../../services/authService";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "learner",
    preferredLanguage: "sinhala",
    region: "",
    isLowIncome: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }

    setError("");
    setLoading(true);

    try {
      await registerUser(formData);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    }

    setLoading(false);
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "80vh" }}
    >
      <Card style={{ width: "500px" }} className="shadow">
        <Card.Body>
          <h2 className="text-center mb-4">
            <FaUserPlus className="me-2" />
            Register
          </h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col} controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formConfirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col} md={6} controlId="formRole">
                <Form.Label>Account Type</Form.Label>
                <Form.Select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="learner">Learner</option>
                  <option value="contributor">Contributor</option>
                  <option value="admin">Admin</option>
                </Form.Select>
              </Form.Group>

              <Form.Group as={Col} md={6} controlId="formLanguage">
                <Form.Label>Preferred Language</Form.Label>
                <Form.Select
                  name="preferredLanguage"
                  value={formData.preferredLanguage}
                  onChange={handleChange}
                >
                  <option value="sinhala">Sinhala</option>
                  <option value="tamil">Tamil</option>
                  <option value="english">English</option>
                </Form.Select>
              </Form.Group>
            </Row>

            <Form.Group className="mb-3" controlId="formRegion">
              <Form.Label>Region</Form.Label>
              <Form.Control
                type="text"
                name="region"
                value={formData.region}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formLowIncome">
              <Form.Check
                type="checkbox"
                label="Limited internet connectivity"
                name="isLowIncome"
                checked={formData.isLowIncome}
                onChange={handleChange}
              />
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              className="w-100 mt-3"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </Button>
          </Form>

          <div className="text-center mt-3">
            Already have an account? <Link to="/login">Login</Link>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Register;
