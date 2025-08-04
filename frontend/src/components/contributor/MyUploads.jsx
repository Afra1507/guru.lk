import React, { useEffect, useState } from "react";
import { Table, Spinner, Alert, Button } from "react-bootstrap";
import { useContent } from "../../hooks/useContent";
import { useAuth } from "../../auth/useAuth";

const MyUploads = () => {
  const [uploads, setUploads] = useState([]);
  const { fetchUserUploads, loading, error } = useContent();
  const { user } = useAuth();

  useEffect(() => {
    const loadUploads = async () => {
      if (!user) return;
      try {
        const data = await fetchUserUploads(user.id);
        setUploads(data);
      } catch (err) {
        console.error(err);
      }
    };
    loadUploads();
  }, [user, fetchUserUploads]);

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="p-3 border rounded">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>My Uploads</h4>
        <Button variant="primary" size="sm">
          Upload New Lesson
        </Button>
      </div>

      {uploads.length > 0 ? (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Views</th>
              <th>Downloads</th>
              <th>Uploaded</th>
            </tr>
          </thead>
          <tbody>
            {uploads.map((upload) => (
              <tr key={upload.lessonId}>
                <td>{upload.title}</td>
                <td>
                  <span
                    className={`badge bg-${
                      upload.isApproved ? "success" : "warning"
                    }`}
                  >
                    {upload.isApproved ? "Approved" : "Pending"}
                  </span>
                </td>
                <td>{upload.viewCount}</td>
                <td>{upload.downloadCount || 0}</td>
                <td>{new Date(upload.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <div className="text-center py-4">
          <p>You haven't uploaded any lessons yet.</p>
          <Button variant="outline-primary">Start Uploading</Button>
        </div>
      )}
    </div>
  );
};

export default MyUploads;
