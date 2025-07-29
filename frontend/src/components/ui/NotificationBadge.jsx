import React from "react";
import { Badge } from "react-bootstrap";
import { FaBell } from "react-icons/fa";

const NotificationBadge = ({ count = 0, onClick }) => {
  return (
    <div
      className="position-relative d-inline-block"
      style={{ cursor: "pointer" }}
      onClick={onClick}
    >
      <FaBell size={20} className="text-white" />
      {count > 0 && (
        <Badge
          pill
          bg="danger"
          className="position-absolute top-0 start-100 translate-middle"
        >
          {count > 9 ? "9+" : count}
        </Badge>
      )}
    </div>
  );
};

export default NotificationBadge;
