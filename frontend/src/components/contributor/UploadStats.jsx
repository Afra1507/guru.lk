import React, { useEffect, useState } from "react";
import { Card, Spinner, Alert } from "react-bootstrap";
import { useContent } from "../../hooks/useContent";
import { useAuth } from "../../auth/useAuth";

const UploadStats = () => {
  const [stats, setStats] = useState(null);
  const { fetchUploadStats, loading, error } = useContent();
  const { user } = useAuth();

  useEffect(() => {
    const loadStats = async () => {
      if (!user) return;
      try {
        const data = await fetchUploadStats(user.id);
        setStats(data);
      } catch (err) {
        console.error(err);
      }
    };
    loadStats();
  }, [user, fetchUploadStats]);

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!stats) return null;

  return (
    <Card className="shadow-sm">
      <Card.Body>
        <Card.Title>Upload Statistics</Card.Title>
        <div className="d-flex justify-content-between mt-3">
          <div className="text-center">
            <h5>{stats.totalUploads}</h5>
            <small className="text-muted">Total</small>
          </div>
          <div className="text-center">
            <h5 className="text-success">{stats.approved}</h5>
            <small className="text-muted">Approved</small>
          </div>
          <div className="text-center">
            <h5 className="text-warning">{stats.pending}</h5>
            <small className="text-muted">Pending</small>
          </div>
          <div className="text-center">
            <h5>{stats.downloads}</h5>
            <small className="text-muted">Downloads</small>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default UploadStats;
