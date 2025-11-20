import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:5000',
});

api.interceptors.request.use((config) => {
  if (!config.headers.Authorization) {
    const adminToken = import.meta.env.VITE_ADMIN_TOKEN;
    config.headers.Authorization = `Bearer ${adminToken}`;
  }
  return config;
});


export default api;
