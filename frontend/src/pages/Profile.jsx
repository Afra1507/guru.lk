import React, { useEffect, useState } from "react";
import ProfileInfo from '../components/profile/ProfileInfo';
import UserManagement from '../components/admin/UserManagement';
import Sidebar from '../components/layout/Sidebar';
import { Container, Row, Col } from "react-bootstrap";

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Load user from localStorage (you can also fetch fresh profile from backend)
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  const role = user.role?.toUpperCase();

  return (
    <Container fluid>
      <Row>
        <Col xs={12} md={3}>
          <Sidebar role={role} />
        </Col>
        <Col xs={12} md={9} className="p-4">
          <h2>{role === "ADMIN" ? "Admin Dashboard" : "User Profile"}</h2>
          <ProfileInfo user={user} setUser={setUser} />
          {role === "ADMIN" && <UserManagement />}
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
