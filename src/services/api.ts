import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'https://nego-maq-api.onrender.com/';

const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config) => {
  if (config.headers && config.headers.Authorization) {
    return config;
  }
  const adminToken = import.meta.env.VITE_ADMIN_TOKEN;
  if (adminToken) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${adminToken}`;
  }
  return config;
});

export default api;
