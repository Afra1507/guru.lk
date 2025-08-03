import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useNavigate } from "react-router-dom";
import LanguageSelector from "./LanguageSelector";
import { useAuth } from "../../auth/useAuth";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleDashboardRedirect = () => {
    if (!user) return;
    if (user.role === "ADMIN") {
      navigate("/admin");
    } else if (user.role === "CONTRIBUTOR") {
      navigate("/contributor/uploads");
    } else {
      navigate("/learner");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
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
            {user ? (
              <NavDropdown
                title={
                  <span>
                    <span className="me-2">
                      {/* Avatar initial */}
                      <span
                        style={{
                          background: "#fff",
                          color: "#0d6efd",
                          padding: "0.3rem 0.6rem",
                          borderRadius: "50%",
                          fontWeight: "bold",
                          textTransform: "uppercase",
                          fontSize: "0.9rem",
                        }}
                      >
                        {user?.username?.charAt(0) || "U"}
                      </span>
                    </span>
                    Account
                  </span>
                }
                id="account-dropdown"
              >
                <NavDropdown.ItemText>
                  <span
                    className={`badge ${
                      user.role === "ADMIN"
                        ? "bg-danger"
                        : user.role === "CONTRIBUTOR"
                        ? "bg-warning text-dark"
                        : "bg-success"
                    }`}
                  >
                    {user.role}
                  </span>
                </NavDropdown.ItemText>

                <NavDropdown.Item onClick={handleDashboardRedirect}>
                  {user.role === "ADMIN"
                    ? "Admin Dashboard"
                    : user.role === "CONTRIBUTOR"
                    ? "Contributor Dashboard"
                    : "My Dashboard"}
                </NavDropdown.Item>

                <NavDropdown.Item onClick={() => navigate("/profile")}>
                  My Profile
                </NavDropdown.Item>

                <NavDropdown.Item onClick={() => alert("No new notifications")}>
                  Notifications 🔔
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
