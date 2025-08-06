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
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useContent } from "../../hooks/useContent";
import { useAuth } from "../../auth/useAuth";
import "../../styles/main.scss";

const Sidebar = () => {
  const [role, setRole] = useState("learner");
  const [expandedSections, setExpandedSections] = useState({ content: true });
  const [pendingApprovalsCount, setPendingApprovalsCount] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user } = useAuth();
  const { fetchPendingLessons } = useContent();

  useEffect(() => {
    if (user?.role) {
      setRole(user.role.toLowerCase());
    }

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

    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth > 768); // auto-close on small screens
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [user, fetchPendingLessons]);

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  // Common links for all roles
  const commonLinks = [
    { path: "/profile", icon: <FaUser />, text: "My Profile" },
    { path: "/lessons", icon: <FaBook />, text: "Browse Lessons" },
  ];

  const learnerLinks = [
    { path: "/", icon: <FaHome />, text: "Dashboard" },
    {
      path: "/downloads",
      icon: <FaDownload />,
      text: "My Downloads",
    },
  ];

  const contributorLinks = [
    { path: "/contributor", icon: <FaHome />, text: "Dashboard" },
    {
      path: "/upload",
      icon: <FaUpload />,
      text: "Upload Content",
    },
  ];

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
    <>
      {/* Hamburger button */}
      <div className="hamburger-btn" onClick={toggleSidebar}>
        {isSidebarOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
      </div>

      {/* Sidebar */}
      <div className={`sidebar-container ${isSidebarOpen ? "open" : "closed"}`}>
        <Nav className="flex-column sidebar p-3">
          {links.map((link, index) => {
            if (link.isSection) {
              return (
                <div key={index} className="mb-2">
                  <Nav.Link
                    className="sidebar-section-header"
                    onClick={() => toggleSection(link.sectionKey)}
                  >
                    <span className="me-3">{link.icon}</span>
                    <span className="flex-grow-1">{link.text}</span>
                    <span>{expandedSections[link.sectionKey] ? "▼" : "▶"}</span>
                  </Nav.Link>

                  {expandedSections[link.sectionKey] && (
                    <div className="ms-4">
                      {link.children.map((child, childIndex) => (
                        <LinkContainer to={child.path} key={childIndex}>
                          <Nav.Link className="sidebar-link">
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
                <div key={index} className="sidebar-header">
                  <LinkContainer to={link.path}>
                    <Nav.Link className="fw-bold sidebar-link">
                      <span className="me-3">{link.icon}</span>
                      {link.text}
                    </Nav.Link>
                  </LinkContainer>
                </div>
              );
            }

            return (
              <LinkContainer to={link.path} key={index}>
                <Nav.Link className="sidebar-link">
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
      </div>
    </>
  );
};

export default Sidebar;
