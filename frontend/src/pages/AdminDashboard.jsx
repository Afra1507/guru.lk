import React from "react";
import { Container, Row, Col, Card, Tab, Tabs } from "react-bootstrap";
import Sidebar from "../components/layout/Sidebar";
import UserManagement from "../components/admin/UserManagement";
import PlatformAnalytics from "../components/admin/PlatformAnalytics";

const AdminDashboard = () => {
  return (
    <Container fluid>
      <Row>
        <Col md={2} className="px-0">
          <Sidebar role="admin" />
        </Col>
        <Col md={10} className="py-4">
          <h2 className="mb-4">Admin Dashboard</h2>

          <Tabs defaultActiveKey="users" className="mb-3">
            <Tab eventKey="users" title="User Management">
              <UserManagement />
            </Tab>
            <Tab eventKey="analytics" title="Platform Analytics">
              <PlatformAnalytics />
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;
