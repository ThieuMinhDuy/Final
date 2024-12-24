import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Thêm interceptor để tự động gắn token vào header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Thêm interceptor để xử lý lỗi response
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Chỉ logout khi token thực sự không hợp lệ
    if (error.response?.status === 401 && 
        error.response?.data?.message !== 'Không tìm thấy token xác thực') {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api; 