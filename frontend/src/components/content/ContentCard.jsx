import React, { useState } from "react";
import { Card, Button, Badge } from "react-bootstrap";
import { FaDownload } from "react-icons/fa";
import { useAuth } from "../../auth/useAuth";
import { useNavigate } from "react-router-dom";
import contentService from "../../services/contentService";
import { jwtDecode } from "jwt-decode";

const ContentCard = ({ lesson }) => {
  const navigate = useNavigate();
  const [isDownloading, setIsDownloading] = useState(false);
  const { isAuthenticated, user } = useAuth();

  // Function to get userId from JWT token
  const getUserIdFromToken = () => {
    try {
      const token = localStorage.getItem("token"); // Adjust key if you store token elsewhere
      if (!token) return undefined;
      const decoded = jwtDecode(token);
      return decoded?.id || decoded?.userId || decoded?.sub; // depends on your token structure
    } catch (e) {
      console.error("Failed to decode token", e);
      return undefined;
    }
  };

  const handleDownload = async (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      alert("Please login to download");
      return;
    }

    const userId = getUserIdFromToken();
    const lessonId = lesson.lessonId;

    if (!userId) {
      alert("Could not determine user ID. Please login again.");
      return;
    }

    try {
      setIsDownloading(true);

      // Call the createDownload endpoint to register download and get JSON response
      const downloadResponse = await contentService.createDownload(
        userId,
        lessonId
      );
      console.log("Download API response:", downloadResponse);
      alert("Download registered!");

      // Extract fileUrl from the response JSON
      const fileUrl = downloadResponse.fileUrl;

      if (!fileUrl) {
        alert("Download URL not found in the response.");
        return;
      }

      // Open the fileUrl in a new tab
      window.open(fileUrl, "_blank");
    } catch (err) {
      console.error("Download failed:", err);
      alert(err.message || "Download failed");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleView = () => {
    navigate(`/lessons/${lesson.lessonId}`);
  };

  return (
    <Card onClick={handleView} style={{ cursor: "pointer" }}>
      <Card.Body>
        <Card.Title>{lesson.title}</Card.Title>
        <Card.Text>{lesson.description}</Card.Text>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <Badge bg="info" className="me-2">
              {lesson.subject}
            </Badge>
            <Badge bg="secondary">{lesson.language}</Badge>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={handleDownload}
            disabled={isDownloading}
          >
            <FaDownload /> {isDownloading ? "Processing..." : "Download"}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ContentCard;
