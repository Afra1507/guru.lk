import React, { useEffect, useState } from "react";
import { Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import {
  FaHome,
  FaBook,
  FaQuestionCircle,
  FaUser,
  FaUpload,
  FaUsersCog,
  FaCheckCircle,
  FaDownload,
  FaChartLine,
  FaCog,
  FaGraduationCap,
  FaFileAlt,
} from "react-icons/fa";

const Sidebar = () => {
  const [role, setRole] = useState("learner");
  const [expandedSections, setExpandedSections] = useState({
    admin: true,
    content: true,
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.role) {
      setRole(user.role.toLowerCase());
    }
  }, []);

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
    { path: "/qna", icon: <FaQuestionCircle />, text: "Q&A Forum" },
  ];

  // Learner specific links
  const learnerLinks = [
    { path: "/learner", icon: <FaHome />, text: "Dashboard" },
    { path: "/learner/downloads", icon: <FaDownload />, text: "My Downloads" },
  ];

  // Contributor specific links
  const contributorLinks = [
    { path: "/contributor", icon: <FaHome />, text: "Dashboard" },
    { path: "/contributor/uploads", icon: <FaFileAlt />, text: "My Uploads" },
    { path: "/contributor/new", icon: <FaUpload />, text: "Upload Content" },
    { path: "/contributor/stats", icon: <FaChartLine />, text: "Statistics" },
  ];

  // Admin specific links grouped by functionality
  const adminContentLinks = [
    {
      path: "/admin/content/pending",
      icon: <FaCheckCircle />,
      text: "Pending Approvals",
    },
    { path: "/admin/content/all", icon: <FaBook />, text: "All Content" },
    {
      path: "/admin/content/reports",
      icon: <FaFileAlt />,
      text: "Content Reports",
    },
  ];

  const adminUserLinks = [
    { path: "/admin/users", icon: <FaUsersCog />, text: "Manage Users" },
    {
      path: "/admin/users/activity",
      icon: <FaChartLine />,
      text: "User Activity",
    },
  ];

  const adminSystemLinks = [
    { path: "/admin/system", icon: <FaCog />, text: "System Settings" },
    { path: "/admin/system/logs", icon: <FaFileAlt />, text: "Audit Logs" },
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
      {
        text: "User Management",
        icon: <FaUsersCog />,
        isSection: true,
        sectionKey: "users",
        children: adminUserLinks,
      },
      {
        text: "System",
        icon: <FaCog />,
        isSection: true,
        sectionKey: "system",
        children: adminSystemLinks,
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
            </Nav.Link>
          </LinkContainer>
        );
      })}
    </Nav>
  );
};

export default Sidebar;
