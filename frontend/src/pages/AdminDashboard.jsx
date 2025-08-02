import { useEffect, useState } from "react";
import {
  fetchAllUsers,
  deleteUser,
  updateUserRole,
} from "../services/adminService";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [currentUsername, setCurrentUsername] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user")); // Adjust to your auth state
    setCurrentUsername(user?.username);
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      const res = await fetchAllUsers();
      setUsers(res.data);
    } catch (err) {
      setError("Failed to fetch users.");
    }
  }

  async function handleDelete(userId, username) {
    if (username === currentUsername) {
      alert("You can't delete yourself.");
      return;
    }
    await deleteUser(userId);
    loadUsers();
  }

  async function handleRoleChange(userId, newRole, username) {
    if (username === currentUsername) {
      alert("You can't modify your own role.");
      return;
    }
    await updateUserRole(userId, newRole);
    loadUsers();
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      {error && <p className="text-red-500">{error}</p>}

      <table className="min-w-full table-auto border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border">Username</th>
            <th className="px-4 py-2 border">Email</th>
            <th className="px-4 py-2 border">Role</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.userId} className="text-center">
              <td className="px-4 py-2 border">{user.username}</td>
              <td className="px-4 py-2 border">{user.email}</td>
              <td className="px-4 py-2 border">
                <select
                  value={user.role}
                  onChange={(e) =>
                    handleRoleChange(user.userId, e.target.value, user.username)
                  }
                  disabled={user.username === currentUsername}
                >
                  <option value="LEARNER">LEARNER</option>
                  <option value="CONTRIBUTOR">CONTRIBUTOR</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </td>
              <td className="px-4 py-2 border">
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => handleDelete(user.userId, user.username)}
                  disabled={user.username === currentUsername}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan={4} className="text-center py-4">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;
