import React, { useState, useEffect } from "react";
import { Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import Sidebar from "../components/layout/Sidebar";
import ProfileInfo from "../components/profile/ProfileInfo";
import ProfileStats from "../components/profile/ProfileStats";
import { fetchUserProfile as getProfile } from '../services/authService';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await getProfile();
        setProfile(data);
      } catch {
        setError("Failed to load profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
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
          <Sidebar role={profile?.role?.toLowerCase() || "learner"} />
        </Col>
        <Col md={10} className="py-4">
          <h2 className="mb-4">My Profile</h2>

          {profile && (
            <>
              <ProfileStats stats={profile.stats} />
              <ProfileInfo user={profile} />
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
