import api from './api';

export const adminService = {
  // Lấy thống kê tổng quan
  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response;
  },

  // Lấy danh sách người dùng
  getUsers: async () => {
    const response = await api.get('/admin/users');
    return response.users;
  },

  // Cập nhật role người dùng
  updateUserRole: async (userId, role) => {
    const response = await api.put(`/admin/users/${userId}/role`, { role });
    return response;
  }
};

