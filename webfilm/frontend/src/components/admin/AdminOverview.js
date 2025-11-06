import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { adminService } from '../../services/adminService';
import './AdminPages.css';

export default function AdminOverview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await adminService.getStats();
      setStats(data);
    } catch (error) {
      console.error('Lỗi tải thống kê:', error);
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
  };

  return (
    <div className="admin-page">
      <h1>Tổng quan</h1>

      <div className="admin-stats-grid">
        <div className="stat-card">
          <h3>Đơn đặt vé hôm nay</h3>
          <p className="stat-value">{stats.overview.todayBookings}</p>
        </div>
        <div className="stat-card">
          <h3>Doanh thu hôm nay</h3>
          <p className="stat-value">{formatCurrency(stats.overview.todayRevenue)}</p>
        </div>
        <div className="stat-card">
          <h3>Người dùng mới hôm nay</h3>
          <p className="stat-value">{stats.overview.newUsersToday}</p>
        </div>
        <div className="stat-card">
          <h3>Tổng số phim</h3>
          <p className="stat-value">{stats.overview.totalMovies}</p>
        </div>
        <div className="stat-card">
          <h3>Tổng số người dùng</h3>
          <p className="stat-value">{stats.overview.totalUsers}</p>
        </div>
      </div>

      <div className="admin-chart-section">
        <h2>Doanh thu 7 ngày gần nhất</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={stats.revenueByDay}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickFormatter={formatDate} />
            <YAxis />
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke="#8884d8" name="Doanh thu" />
            <Line type="monotone" dataKey="bookings" stroke="#82ca9d" name="Số đơn" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="admin-chart-section">
        <h2>Top 5 phim bán chạy (7 ngày gần nhất)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats.topMovies}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="title" angle={-45} textAnchor="end" height={100} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="booking_count" fill="#8884d8" name="Số đơn" />
            <Bar dataKey="revenue" fill="#82ca9d" name="Doanh thu" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

