import React from 'react';
import UserManagement from '../components/admin/UserManagement';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <div className="container-fluid p-4">
        <h1 className="mb-4">Admin Dashboard</h1>
        <UserManagement />
      </div>
    </div>
  );
};

export default AdminDashboard;