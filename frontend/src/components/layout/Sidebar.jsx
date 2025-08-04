// D:\guru.lk\frontend\src\components\layout\Sidebar.jsx
import React, { useEffect, useState } from "react";
import { Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import {
  FaHome,
  FaBook,
  FaUser,
  FaUpload,
  FaCheckCircle,
  FaDownload,
  FaChartLine,
} from "react-icons/fa";
import { useContent } from "../../hooks/useContent";
import { useAuth } from "../../auth/useAuth";

const Sidebar = () => {
  const [role, setRole] = useState("learner");
  const [expandedSections, setExpandedSections] = useState({
    content: true,
  });
  const [pendingApprovalsCount, setPendingApprovalsCount] = useState(0);
  const { user } = useAuth();
  const { fetchPendingLessons, loading } = useContent();

  useEffect(() => {
    // Set user role
    if (user?.role) {
      setRole(user.role.toLowerCase());
    }

    // Load pending approvals count for admins
    if (user?.role?.toLowerCase() === "admin") {
      const loadPendingCount = async () => {
        try {
          const pendingLessons = await fetchPendingLessons();
          setPendingApprovalsCount(pendingLessons.length);
        } catch (err) {
          console.error("Failed to fetch pending lessons:", err);
        }
      };
      loadPendingCount();
    }
  }, [user, fetchPendingLessons]);

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Common links for all roles
  const commonLinks = [
    { path: "/profile", icon: <FaUser />, text: "My Profile" },
    { path: "/lessons", icon: <FaBook />, text: "Browse Lessons" },
  ];

  // Learner specific links
  const learnerLinks = [
    { path: "/", icon: <FaHome />, text: "Dashboard" },
    {
      path: "/downloads",
      icon: <FaDownload />,
      text: "My Downloads",
      fetchCount: true, // This would need implementation similar to pending approvals
    },
  ];

  // Contributor specific links
  const contributorLinks = [
    { path: "/contributor", icon: <FaHome />, text: "Dashboard" },
    {
      path: "/upload",
      icon: <FaUpload />,
      text: "Upload Content",
    },
  ];

  // Admin content management links
  const adminContentLinks = [
    {
      path: "/admin/approvals",
      icon: <FaCheckCircle />,
      text: "Pending Approvals",
      badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : null,
    },
    {
      path: "/admin/lessons",
      icon: <FaBook />,
      text: "All Lessons",
    },
    {
      path: "/admin/analytics",
      icon: <FaChartLine />,
      text: "Content Analytics",
    },
  ];

  // Combine links based on role
  let links = [...learnerLinks, ...commonLinks];
  if (role === "contributor") {
    links = [...contributorLinks, ...commonLinks];
  } else if (role === "admin") {
    links = [
      { path: "/admin", icon: <FaHome />, text: "Dashboard", isHeader: true },
      {
        text: "Content Management",
        icon: <FaBook />,
        isSection: true,
        sectionKey: "content",
        children: adminContentLinks,
      },
      ...commonLinks,
    ];
  }

  return (
    <Nav
      className="flex-column sidebar bg-light p-3"
      style={{ minHeight: "100vh" }}
    >
      {links.map((link, index) => {
        if (link.isSection) {
          return (
            <div key={index} className="mb-2">
              <Nav.Link
                className="d-flex align-items-center py-2 px-3 section-header"
                onClick={() => toggleSection(link.sectionKey)}
                style={{ cursor: "pointer" }}
              >
                <span className="me-3">{link.icon}</span>
                <span className="flex-grow-1">{link.text}</span>
                <span>{expandedSections[link.sectionKey] ? "▼" : "▶"}</span>
              </Nav.Link>

              {expandedSections[link.sectionKey] && (
                <div className="ms-4">
                  {link.children.map((child, childIndex) => (
                    <LinkContainer to={child.path} key={childIndex}>
                      <Nav.Link className="d-flex align-items-center py-2 px-3">
                        <span className="me-3">{child.icon}</span>
                        {child.text}
                        {child.badge && (
                          <span className="ms-auto badge bg-danger rounded-pill">
                            {child.badge}
                          </span>
                        )}
                      </Nav.Link>
                    </LinkContainer>
                  ))}
                </div>
              )}
            </div>
          );
        }

        if (link.isHeader) {
          return (
            <div key={index} className="border-bottom mb-3 pb-2">
              <LinkContainer to={link.path}>
                <Nav.Link className="d-flex align-items-center py-2 px-3 fw-bold">
                  <span className="me-3">{link.icon}</span>
                  {link.text}
                </Nav.Link>
              </LinkContainer>
            </div>
          );
        }

        return (
          <LinkContainer to={link.path} key={index}>
            <Nav.Link className="d-flex align-items-center py-2 px-3">
              <span className="me-3">{link.icon}</span>
              {link.text}
              {link.badge && (
                <span className="ms-auto badge bg-danger rounded-pill">
                  {link.badge}
                </span>
              )}
            </Nav.Link>
          </LinkContainer>
        );
      })}
    </Nav>
  );
};

export default Sidebar;
