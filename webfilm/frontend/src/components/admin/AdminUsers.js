import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import './AdminPages.css';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await adminService.getUsers();
      setUsers(data || []);
    } catch (error) {
      console.error('Lỗi tải người dùng:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await adminService.updateUserRole(userId, newRole);
      await loadUsers(); // Reload danh sách
      alert('Cập nhật quyền thành công!');
    } catch (error) {
      console.error('Lỗi cập nhật quyền:', error);
      alert('Lỗi cập nhật quyền: ' + (error.response?.data?.error || error.message));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  if (loading) {
    return <div className="admin-loading">Đang tải...</div>;
  }

  return (
    <div className="admin-page">
      <h1>Quản lý người dùng</h1>

      <div className="admin-stats-summary">
        <p>Tổng số người dùng: <strong>{users.length}</strong></p>
        <p>Admin: <strong>{users.filter(u => u.role === 'admin').length}</strong></p>
        <p>User: <strong>{users.filter(u => u.role === 'user').length}</strong></p>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên</th>
              <th>Email</th>
              <th>Số điện thoại</th>
              <th>Điểm</th>
              <th>Hạng</th>
              <th>Quyền</th>
              <th>Ngày tạo</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone || 'N/A'}</td>
                <td>{user.points || 0}</td>
                <td>
                  <span className={`membership-badge membership-${user.membership_level || 'bronze'}`}>
                    {user.membership_level || 'bronze'}
                  </span>
                </td>
                <td>
                  <select
                    value={user.role || 'user'}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="role-select"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td>{formatDate(user.created_at)}</td>
                <td>
                  <button className="btn-small" onClick={() => handleRoleChange(user.id, user.role === 'admin' ? 'user' : 'admin')}>
                    {user.role === 'admin' ? 'Hạ quyền' : 'Nâng quyền'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

