// src/pages/contributor/ContributorDashboard.jsx
import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import { Container, Nav } from "react-bootstrap";

const ContributorDashboard = () => {
  return (
    <Container fluid className="p-3">
      <h3 className="mb-4">Contributor Dashboard</h3>
      <Nav variant="tabs" className="mb-3">
        <Nav.Item>
          <NavLink to="/contributor" end className="nav-link">
            Overview
          </NavLink>
        </Nav.Item>
        <Nav.Item>
          <NavLink to="/contributor/new" className="nav-link">
            Upload Content
          </NavLink>
        </Nav.Item>
        <Nav.Item>
          <NavLink to="/contributor/my-uploads" className="nav-link">
            My Uploads
          </NavLink>
        </Nav.Item>
        <Nav.Item>
          <NavLink to="/contributor/stats" className="nav-link">
            Statistics
          </NavLink>
        </Nav.Item>
      </Nav>

      <Outlet />
    </Container>
  );
};

export default ContributorDashboard;
