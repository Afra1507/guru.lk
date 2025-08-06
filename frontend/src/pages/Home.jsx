import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import SearchFilter from "../components/content/SearchFilter";
import ContentCard from "../components/content/ContentCard";
import contentService from "../services/contentService";

const Home = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [popularLessons, setPopularLessons] = useState([]);
  const [loadingPopular, setLoadingPopular] = useState(true);
  const [errorPopular, setErrorPopular] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setCurrentUser(user);
      setShowWelcome(true);
    }
  }, []);

  useEffect(() => {
    if (showWelcome) {
      const timer = setTimeout(() => setShowWelcome(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showWelcome]);

  // Fetch popular lessons on mount
  useEffect(() => {
    setLoadingPopular(true);
    setErrorPopular(null);
    contentService
      .getPopularLessons()
      .then((data) => {
        setPopularLessons(data);
        setLoadingPopular(false);
      })
      .catch((err) => {
        setErrorPopular("Failed to load popular lessons.");
        setLoadingPopular(false);
        console.error(err);
      });
  }, []);

  const handleLogin = () => navigate("/login");
  const handleRegister = () => navigate("/register");
  const handleLogout = () => {
    localStorage.removeItem("user");
    setCurrentUser(null);
  };

  const handleProfileRedirect = () => {
    if (currentUser?.role === "ADMIN") {
      navigate("/admin");
    } else {
      navigate("/profile");
    }
  };

  const getWelcomeMessage = () => {
    if (!currentUser) return null;
    switch (currentUser.role) {
      case "ADMIN":
        return "Welcome, Admin!";
      case "CONTRIBUTOR":
        return "Welcome, Contributor!";
      case "LEARNER":
      default:
        return "Welcome, Learner!";
    }
  };

  const role = currentUser?.role;

  return (
    <Container>
      {/* Welcome Message */}
      {currentUser && showWelcome && (
        <Row className="mt-3">
          <Col>
            <Alert variant="success" className="text-center">
              {getWelcomeMessage()}
            </Alert>
          </Col>
        </Row>
      )}

      {/* Header Section */}
      <Row className="my-4 align-items-center">
        <Col>
          <h1>Welcome to GURU.Ik</h1>
          <p className="lead">
            Community Knowledge Sharing Platform for All Sri Lankans
          </p>
        </Col>
        <Col md="auto">
          {currentUser ? (
            <div className="d-flex gap-2">
              <Button
                variant={role === "ADMIN" ? "danger" : "outline-primary"}
                onClick={handleProfileRedirect}
              >
                {role === "ADMIN" ? "Admin Dashboard" : "My Profile"}
              </Button>
              <Button variant="outline-danger" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          ) : (
            <div className="d-flex gap-2">
              <Button variant="primary" onClick={handleLogin}>
                Login
              </Button>
              <Button variant="outline-primary" onClick={handleRegister}>
                Register
              </Button>
            </div>
          )}
        </Col>
      </Row>

      {/* Optional notice based on role */}
      {role === "CONTRIBUTOR" && (
        <Row className="mb-3">
          <Col>
            <Alert variant="info">
              Welcome, contributor! Head to your profile to upload or edit your
              lessons.
            </Alert>
          </Col>
        </Row>
      )}

      {/* Filters - visible to everyone */}
      <Row className="mb-4">
        <Col>
          <SearchFilter />
        </Col>
      </Row>

      {/* Popular Lessons Section */}
      <Row className="mb-4">
        <Col>
          <h2>Top Viewed Lessons</h2>
        </Col>
      </Row>
      <Row>
        {loadingPopular ? (
          <Col>
            <p>Loading popular lessons...</p>
          </Col>
        ) : errorPopular ? (
          <Col>
            <Alert variant="danger">{errorPopular}</Alert>
          </Col>
        ) : popularLessons.length === 0 ? (
          <Col>
            <p>No popular lessons available yet.</p>
          </Col>
        ) : (
          popularLessons.map((lesson) => (
            <Col key={lesson.id} md={6} lg={4} className="mb-4">
              <ContentCard lesson={lesson} />
            </Col>
          ))
        )}
      </Row>

      {/* Browse Button */}
      <Row className="mt-4">
        <Col className="text-center">
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate("/lessons")}
          >
            Browse All Lessons
          </Button>
        </Col>
      </Row>

      {/* Admin-only section */}
      {role === "ADMIN" && (
        <Row className="mt-5">
          <Col>
            <h4>Admin Tools</h4>
            <div className="d-flex gap-3">
              <Button
                variant="outline-dark"
                onClick={() => navigate("/admin/users")}
              >
                Manage Users
              </Button>
              <Button
                variant="outline-secondary"
                onClick={() => navigate("/admin/content")}
              >
                Review Content
              </Button>
            </div>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Home;
