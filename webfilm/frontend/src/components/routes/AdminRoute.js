import React from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import AdminDashboard from '../AdminDashboard';

export default function AdminRoute({ user, onAuthRequired }) {
  const navigate = useNavigate();

  if (!user) {
    if (onAuthRequired) onAuthRequired();
    return (
      <div style={{ padding: 24 }}>
        <h2>Yêu cầu đăng nhập</h2>
        <p>Vui lòng đăng nhập để truy cập trang quản trị.</p>
      </div>
    );
  }

  if (user && user.role !== 'admin') {
    return (
      <div style={{ padding: 24 }}>
        <h2>403 - Không có quyền truy cập</h2>
        <p>Tài khoản của bạn không có quyền vào trang này.</p>
        <button className="btn btn-outline" onClick={() => navigate('/')}>Về trang chủ</button>
      </div>
    );
  }

  return <AdminDashboard user={user} />;
}


