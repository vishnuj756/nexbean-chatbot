import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    withCredentials: false,
    'Content-Type': 'application/json',
  },
});

// --- Request Interceptor ---
// Runs before every request is sent
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- Response Interceptor ---
// Runs after a response is received
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Global Error Handling
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/auth/login'; 
    }
    
    // Customize the error message for the frontend
    const message = error.response?.data?.message || 'Something went wrong';
    return Promise.reject(message);
  }
);

export default api;