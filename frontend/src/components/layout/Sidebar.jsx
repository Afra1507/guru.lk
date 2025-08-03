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
} from "react-icons/fa";

const Sidebar = () => {
  const [role, setRole] = useState("learner");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.role) {
      setRole(user.role.toLowerCase());
    }
  }, []);

  const learnerLinks = [
    { path: "/learner", icon: <FaHome />, text: "Dashboard" },
    { path: "/lessons", icon: <FaBook />, text: "Browse Lessons" },
    { path: "/qna", icon: <FaQuestionCircle />, text: "Q&A Forum" },
    { path: "/profile", icon: <FaUser />, text: "My Profile" },
  ];

  const contributorLinks = [
    { path: "/contributor/uploads", icon: <FaHome />, text: "Dashboard" },
    { path: "/lessons", icon: <FaBook />, text: "Browse Lessons" },
    { path: "/qna", icon: <FaQuestionCircle />, text: "Q&A Forum" },
    { path: "/profile", icon: <FaUser />, text: "My Profile" },
    { path: "/contributor/new", icon: <FaUpload />, text: "Upload Content" },
  ];

  const adminLinks = [
    { path: "/admin", icon: <FaUsersCog />, text: "Admin Dashboard" },
    { path: "/admin/users", icon: <FaUsersCog />, text: "Manage Users" },
    { path: "/admin/content", icon: <FaBook />, text: "Review Content" },
    { path: "/profile", icon: <FaUser />, text: "My Profile" },
  ];

  let links = learnerLinks;
  if (role === "contributor") links = contributorLinks;
  else if (role === "admin") links = adminLinks;

  return (
    <Nav
      className="flex-column sidebar bg-light p-3"
      style={{ minHeight: "100vh" }}
    >
      {links.map((link, index) => (
        <LinkContainer to={link.path} key={index}>
          <Nav.Link className="d-flex align-items-center py-2 px-3">
            <span className="me-3">{link.icon}</span>
            {link.text}
          </Nav.Link>
        </LinkContainer>
      ))}
    </Nav>
  );
};

export default Sidebar;
