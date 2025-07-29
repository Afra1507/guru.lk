import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Tab,
  Tabs,
  Spinner,
  Alert,
} from "react-bootstrap";
import Sidebar from "../components/layout/Sidebar";
import MyUploads from "../components/contributor/MyUploads";
import UploadStats from "../components/contributor/UploadStats";
import ContentUpload from "../components/content/ContentUpload";

const ContributorDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Simulate loading contributor data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <Spinner animation="border" />
      </div>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container fluid>
      <Row>
        <Col md={2} className="px-0">
          <Sidebar role="contributor" />
        </Col>
        <Col md={10} className="py-4">
          <h2 className="mb-4">Contributor Dashboard</h2>

          <Tabs defaultActiveKey="uploads" className="mb-3">
            <Tab eventKey="uploads" title="My Uploads">
              <MyUploads />
            </Tab>
            <Tab eventKey="stats" title="Upload Stats">
              <UploadStats />
            </Tab>
            <Tab eventKey="new" title="Upload New Content">
              <ContentUpload />
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </Container>
  );
};

export default ContributorDashboard;
