import React, { useEffect, useState } from "react";
import { Table, Spinner, Alert, Button } from "react-bootstrap";
import { useContent } from "../../hooks/useContent";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // note: import without braces, if your package exports default

const getUploaderIdFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    // Assuming userId or sub stores the user identifier as a number or string
    return Number(decoded.userId || decoded.sub);
  } catch (error) {
    console.error("Failed to decode token", error);
    return null;
  }
};

const MyUploads = () => {
  const [uploads, setUploads] = useState([]);
  const { fetchUserUploads, loading, error } = useContent();
  const navigate = useNavigate();

  useEffect(() => {
    const loadUploads = async () => {
      const uploaderId = getUploaderIdFromToken();

      if (!uploaderId) {
        alert("You must be logged in.");
        navigate("/login");
        return;
      }

      try {
        const data = await fetchUserUploads(uploaderId);
        console.log("Fetched uploads:", data);
        setUploads(data);
      } catch (err) {
        console.error(err);
      }
    };

    loadUploads();
  }, [fetchUserUploads, navigate]);

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="p-3 border rounded">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>My Uploads</h4>
        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate("/contributor/new")}
        >
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
                      upload.approved ? "success" : "warning"
                    }`}
                  >
                    {upload.approved ? "Approved" : "Pending"}
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
          <Button
            variant="outline-primary"
            onClick={() => navigate("/contributor/new")}
          >
            Start Uploading
          </Button>
        </div>
      )}
    </div>
  );
};

export default MyUploads;
