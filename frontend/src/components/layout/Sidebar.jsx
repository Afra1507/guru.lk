import React from "react";
import { Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import {
  FaHome,
  FaBook,
  FaQuestionCircle,
  FaUser,
  FaUpload,
  FaUsersCog,
  FaChartBar,
} from "react-icons/fa";

const Sidebar = ({ role = "learner" }) => {
  const learnerLinks = [
    { path: "/learner", icon: <FaHome />, text: "Dashboard" },
    { path: "/lessons", icon: <FaBook />, text: "Browse Lessons" },
    { path: "/qna", icon: <FaQuestionCircle />, text: "Q&A Forum" },
    { path: "/profile", icon: <FaUser />, text: "My Profile" },
  ];

  const contributorLinks = [
    ...learnerLinks,
    { path: "/upload", icon: <FaUpload />, text: "Upload Content" },
  ];

  const adminLinks = [
    ...contributorLinks,
    { path: "/admin/users", icon: <FaUsersCog />, text: "User Management" },
    { path: "/admin/stats", icon: <FaChartBar />, text: "Platform Analytics" },
  ];

  const links =
    role === "admin"
      ? adminLinks
      : role === "contributor"
      ? contributorLinks
      : learnerLinks;

  return (
    <Nav className="flex-column sidebar">
      {links.map((link, index) => (
        <LinkContainer to={link.path} key={index}>
          <Nav.Link className="d-flex align-items-center py-3 px-3">
            <span className="me-3 sidebar-icon">{link.icon}</span>
            {link.text}
          </Nav.Link>
        </LinkContainer>
      ))}
    </Nav>
  );
};

export default Sidebar;
