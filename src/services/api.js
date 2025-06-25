// src/services/api.js
import axios from 'axios';
import router from '../router'; // for redirecting to /login

const api = axios.create({
    baseURL: 'http://localhost:3001',
    headers: {
      'Content-Type': 'application/json',
    }
});


// 🔒 Add interceptor to include token in all requests
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  // 🔐 Add interceptor for 401/403 errors
api.interceptors.response.use(
    response => response,
    error => {
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        localStorage.removeItem('token');
        router.push('/login');
      }
      if(error.response && error.response.status === 500) {
        router.push('/500');
      }
      return Promise.reject(error);
    }
);
  
export default api;