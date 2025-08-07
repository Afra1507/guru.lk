import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Sidebar from "../layout/Sidebar";
import { Outlet } from "react-router-dom";

const ContributorLayout = () => {
  return (
    <Container fluid>
      <Row>
        <Col md={2} className="px-0">
          <Sidebar />
        </Col>
        <Col md={10} className="py-4">
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
};

export default ContributorLayout;
