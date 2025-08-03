import React, { useEffect, useState } from "react";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useNavigate } from "react-router-dom";
import LanguageSelector from "./LanguageSelector";

const Header = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) setCurrentUser(user);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setCurrentUser(null);
    navigate("/login");
  };

  const handleDashboardRedirect = () => {
    if (!currentUser) return;
    if (currentUser.role === "ADMIN") {
      navigate("/admin");
    } else if (currentUser.role === "CONTRIBUTOR") {
      navigate("/upload");
    } else {
      navigate("/learner");
    }
  };

  return (
    <Navbar bg="primary" variant="dark" expand="lg" collapseOnSelect>
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand>GURU.Ik</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to="/">
              <Nav.Link>Home</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/lessons">
              <Nav.Link>Lessons</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/qna">
              <Nav.Link>Q&A Forum</Nav.Link>
            </LinkContainer>
          </Nav>

          <Nav>
            <LanguageSelector />
            {currentUser ? (
              <NavDropdown title="Account" id="account-dropdown">
                <NavDropdown.Item onClick={handleDashboardRedirect}>
                  {currentUser.role === "ADMIN"
                    ? "Admin Dashboard"
                    : currentUser.role === "CONTRIBUTOR"
                    ? "Contributor Dashboard"
                    : "My Dashboard"}
                </NavDropdown.Item>
                <NavDropdown.Item onClick={() => navigate("/profile")}>
                  My Profile
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <LinkContainer to="/login">
                  <Nav.Link>Login</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/register">
                  <Nav.Link>Register</Nav.Link>
                </LinkContainer>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
