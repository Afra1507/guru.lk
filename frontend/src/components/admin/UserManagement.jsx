import React, { useEffect, useState } from "react";
import { Modal, Button, Card } from "react-bootstrap";
import { API } from "../../api/axiosInstances";

const roles = ["LEARNER", "CONTRIBUTOR", "ADMIN"];

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUsername, setCurrentUsername] = useState("");

  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [userToUpdate, setUserToUpdate] = useState(null);
  const [newRole, setNewRole] = useState("");

  useEffect(() => {
    const userData = localStorage.getItem("user");
    try {
      const parsed = userData ? JSON.parse(userData) : null;
      setCurrentUsername(parsed?.username || "");
    } catch {
      setCurrentUsername("");
    }
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await API.get("/user/admin/all");
      setUsers(res.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch users. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (user) => {
    if (user.username === currentUsername) {
      alert("You cannot delete your own account.");
      return;
    }
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await API.delete(`/user/admin/${userToDelete.userId}`);
      setUsers(users.filter((u) => u.userId !== userToDelete.userId));
      setShowDeleteModal(false);
      setUserToDelete(null);
    } catch (err) {
      alert("Failed to delete user. Please try again.");
    }
  };

  const handleRoleChangeClick = (user) => {
    if (user.username === currentUsername) {
      alert("You cannot modify your own role.");
      return;
    }
    setUserToUpdate(user);
    setNewRole(user.role);
    setShowRoleModal(true);
  };

  const confirmRoleUpdate = async () => {
    try {
      await API.put(`/user/admin/${userToUpdate.userId}/role`, null, {
        params: { role: newRole },
      });
      setUsers(
        users.map((u) =>
          u.userId === userToUpdate.userId ? { ...u, role: newRole } : u
        )
      );
      setShowRoleModal(false);
      setUserToUpdate(null);
    } catch (err) {
      alert("Failed to update user role. Please try again.");
    }
  };

  const formatRole = (role) => {
    if (!role) return "";
    return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
  };

  if (loading)
    return (
      <div className="d-flex justify-content-center p-5">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );

  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <>
      <h3>User Management</h3>
      <div className="d-flex flex-wrap gap-3">
        {users.map((user) => (
          <Card key={user.userId} style={{ minWidth: "18rem" }}>
            <Card.Body>
              <Card.Title>{user.username}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                {user.email}
              </Card.Subtitle>
              <Card.Text>
                <strong>Role:</strong> {formatRole(user.role)}
                <br />
                <strong>Language:</strong> {user.preferredLanguage || "N/A"}
                <br />
                <strong>Region:</strong> {user.region || "N/A"}
                <br />
                <strong>Low Income:</strong> {user.isLowIncome ? "Yes" : "No"}
                <br />
                <strong>Joined:</strong>{" "}
                {new Date(user.createdAt).toLocaleDateString()}
              </Card.Text>

              <Button
                variant="outline-danger"
                size="sm"
                className="me-2"
                onClick={() => handleDeleteClick(user)}
                disabled={user.username === currentUsername}
              >
                Delete
              </Button>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => handleRoleChangeClick(user)}
                disabled={user.username === currentUsername}
              >
                Change Role
              </Button>
            </Card.Body>
          </Card>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete user{" "}
          <strong>{userToDelete?.username}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Change Role Modal */}
      <Modal
        show={showRoleModal}
        onHide={() => setShowRoleModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Change Role for {userToUpdate?.username}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <select
            className="form-select"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
          >
            {roles.map((r) => (
              <option key={r} value={r}>
                {r.charAt(0) + r.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRoleModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={confirmRoleUpdate}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UserManagement;
