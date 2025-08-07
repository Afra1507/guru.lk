import React from "react";
import UploadStats from "../components/contributor/UploadStats";
const ContributorHome = () => {
  return (
    <div>
      <h4>Welcome to Contributor Dashboard</h4>
      <p className="text-muted">Track your uploads and performance here.</p>
      <UploadStats />
    </div>
  );
};

export default ContributorHome;
