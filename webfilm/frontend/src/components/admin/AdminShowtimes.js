import React, { useState, useEffect } from 'react';
import { showtimeService } from '../../services/showtimeService';
import api from '../../services/api';
import './AdminPages.css';

export default function AdminShowtimes() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await api.get('/showtimes/stats');
      setStats(response);
    } catch (error) {
      console.error('Lỗi tải thống kê suất chiếu:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="admin-loading">Đang tải...</div>;
  }

  if (!stats) {
    return <div className="admin-error">Không thể tải dữ liệu</div>;
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <div className="admin-page">
      <h1>Quản lý suất chiếu</h1>
      <p className="admin-note">Tính năng tạo và quản lý suất chiếu sẽ được phát triển trong tương lai.</p>

      <div className="admin-stats-grid">
        <div className="stat-card">
          <h3>Tổng suất chiếu</h3>
          <p className="stat-value">{stats.overview.total_showtimes || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Suất chiếu sắp tới</h3>
          <p className="stat-value">{stats.overview.upcoming_showtimes || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Suất chiếu hôm nay</h3>
          <p className="stat-value">{stats.overview.today_showtimes || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Giá trung bình</h3>
          <p className="stat-value">{formatCurrency(stats.overview.avg_price || 0)}</p>
        </div>
      </div>

      <div className="admin-table-container">
        <h2>Thống kê theo phòng</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Rạp</th>
              <th>Phòng</th>
              <th>Số suất chiếu</th>
              <th>Giá trung bình</th>
            </tr>
          </thead>
          <tbody>
            {stats.roomStats && stats.roomStats.length > 0 ? (
              stats.roomStats.map((room, idx) => (
                <tr key={idx}>
                  <td>{room.cinema_name || 'N/A'}</td>
                  <td>{room.room_number || 'N/A'}</td>
                  <td>{room.showtime_count || 0}</td>
                  <td>{formatCurrency(room.avg_price || 0)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center' }}>Chưa có dữ liệu</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

