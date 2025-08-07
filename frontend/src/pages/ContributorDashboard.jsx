// src/pages/contributor/ContributorDashboard.jsx
import React from "react";
import { Container } from "react-bootstrap";

// Import your section components here
import UploadForm from "../../components/contributor/UploadForm";
import MyUploads from "../../components/contributor/MyUploads";
import StatsOverview from "../../components/contributor/StatsOverview"; // Optional

const ContributorDashboard = () => {
  return (
    <Container fluid className="p-4">
      <h2 className="mb-4">Contributor Dashboard</h2>

      {/* Upload Section */}
      <section className="mb-5">
        <h4>Start Uploading</h4>
        <div className="bg-light p-3 rounded shadow-sm">
          <UploadForm />
        </div>
      </section>

      {/* My Uploads Section */}
      <section className="mb-5">
        <h4>My Uploads</h4>
        <div className="bg-light p-3 rounded shadow-sm">
          <MyUploads />
        </div>
      </section>

      {/* Statistics Section */}
      <section className="mb-5">
        <h4>Statistics</h4>
        <div className="bg-light p-3 rounded shadow-sm">
          <StatsOverview />
        </div>
      </section>

      {/* Optional: Profile Section */}
      {/* <section className="mb-5">
        <h4>Edit My Profile</h4>
        <div className="bg-light p-3 rounded shadow-sm">
          <EditProfileForm />
        </div>
      </section> */}
    </Container>
  );
};

export default ContributorDashboard;
