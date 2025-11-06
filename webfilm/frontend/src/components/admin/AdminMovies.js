import React, { useState, useEffect } from 'react';
import { movieService } from '../../services/movieService';
import './AdminPages.css';

export default function AdminMovies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    try {
      const data = await movieService.getAllMovies();
      setMovies(data || []);
    } catch (error) {
      console.error('Lỗi tải phim:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="admin-loading">Đang tải...</div>;
  }

  return (
    <div className="admin-page">
      <h1>Quản lý phim</h1>
      <p className="admin-note">Tính năng thêm/sửa/xóa phim sẽ được phát triển trong tương lai.</p>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Poster</th>
              <th>Tên phim</th>
              <th>Đánh giá</th>
              <th>Trạng thái</th>
              <th>Hot</th>
            </tr>
          </thead>
          <tbody>
            {movies.map((movie) => (
              <tr key={movie.id}>
                <td>{movie.id}</td>
                <td>
                  <img src={movie.poster_url} alt={movie.title} className="admin-poster-thumb" />
                </td>
                <td>{movie.title}</td>
                <td>{movie.rating || 'N/A'}</td>
                <td>
                  <span className={`status-badge ${movie.status === 'now' ? 'status-now' : 'status-soon'}`}>
                    {movie.status === 'now' ? 'Đang chiếu' : 'Sắp chiếu'}
                  </span>
                </td>
                <td>{movie.is_hot ? '🔥' : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-stats-summary">
        <p>Tổng số phim: <strong>{movies.length}</strong></p>
        <p>Đang chiếu: <strong>{movies.filter(m => m.status === 'now').length}</strong></p>
        <p>Sắp chiếu: <strong>{movies.filter(m => m.status === 'soon').length}</strong></p>
      </div>
    </div>
  );
}

