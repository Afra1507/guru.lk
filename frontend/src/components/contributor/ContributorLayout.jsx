import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Outlet } from "react-router-dom";

const ContributorLayout = () => {
  return (
    <Container fluid>
      <Row>
        <Col md={12} className="py-4">
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
};

export default ContributorLayout;
