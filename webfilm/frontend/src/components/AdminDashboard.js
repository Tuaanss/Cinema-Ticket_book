import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { adminService } from '../services/adminService';
import AdminOverview from './admin/AdminOverview';
import AdminMovies from './admin/AdminMovies';
import AdminShowtimes from './admin/AdminShowtimes';
import AdminUsers from './admin/AdminUsers';
import './AdminDashboard.css';

export default function AdminDashboard({ user }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadQuickStats();
  }, []);

  const loadQuickStats = async () => {
    try {
      const data = await adminService.getStats();
      setStats(data);
    } catch (error) {
      console.error('Lỗi tải thống kê:', error);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const isActive = (path) => {
    if (path === '/admin' && location.pathname === '/admin') return true;
    if (path !== '/admin' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Bảng điều khiển Admin</h1>
        <p>Xin chào, {user?.name || 'Admin'}.</p>
      </div>

      <div className="admin-nav">
        <button 
          className={`admin-nav-btn ${isActive('/admin') ? 'active' : ''}`}
          onClick={() => navigate('/admin')}
        >
          Tổng quan
        </button>
        <button 
          className={`admin-nav-btn ${isActive('/admin/movies') ? 'active' : ''}`}
          onClick={() => navigate('/admin/movies')}
        >
          Quản lý phim
        </button>
        <button 
          className={`admin-nav-btn ${isActive('/admin/showtimes') ? 'active' : ''}`}
          onClick={() => navigate('/admin/showtimes')}
        >
          Suất chiếu
        </button>
        <button 
          className={`admin-nav-btn ${isActive('/admin/users') ? 'active' : ''}`}
          onClick={() => navigate('/admin/users')}
        >
          Người dùng
        </button>
      </div>

      {location.pathname === '/admin' && (
        <div className="admin-grid">
          <section 
            className="admin-card clickable"
            onClick={() => navigate('/admin')}
          >
            <h2>📊 Tổng quan</h2>
            {stats ? (
              <ul>
                <li>Đơn đặt vé hôm nay: <strong>{stats.overview.todayBookings}</strong></li>
                <li>Doanh thu hôm nay: <strong>{formatCurrency(stats.overview.todayRevenue)}</strong></li>
                <li>Người dùng mới: <strong>{stats.overview.newUsersToday}</strong></li>
              </ul>
            ) : (
              <ul>
                <li>Đang tải...</li>
              </ul>
            )}
          </section>

          <section 
            className="admin-card clickable"
            onClick={() => navigate('/admin/movies')}
          >
            <h2>🎬 Quản lý phim</h2>
            {stats && (
              <p>Tổng số phim: <strong>{stats.overview.totalMovies}</strong></p>
            )}
            <p className="admin-card-hint">Click để xem chi tiết</p>
          </section>

          <section 
            className="admin-card clickable"
            onClick={() => navigate('/admin/showtimes')}
          >
            <h2>🎫 Suất chiếu</h2>
            <p>Tạo và quản lý suất chiếu</p>
            <p className="admin-card-hint">Click để xem chi tiết</p>
          </section>

          <section 
            className="admin-card clickable"
            onClick={() => navigate('/admin/users')}
          >
            <h2>👥 Người dùng</h2>
            {stats && (
              <p>Tổng số người dùng: <strong>{stats.overview.totalUsers}</strong></p>
            )}
            <p className="admin-card-hint">Click để quản lý</p>
          </section>
        </div>
      )}

      <div className="admin-content">
        <Routes>
          <Route path="/" element={<AdminOverview />} />
          <Route path="/movies" element={<AdminMovies />} />
          <Route path="/showtimes" element={<AdminShowtimes />} />
          <Route path="/users" element={<AdminUsers />} />
        </Routes>
      </div>
    </div>
  );
}


