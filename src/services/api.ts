import axios from 'axios';

const api = axios.create({
  // baseURL: 'http://127.0.0.1:5000',
  baseURL: 'https://nego-maq-api.onrender.com/',
});

api.interceptors.request.use((config) => {
  // Se já existe um token no header vindo da requisição, usa ele
  if (config.headers && config.headers.Authorization) {
    return config;
  }
  // Caso NÃO exista token → usa o token admin
  const adminToken = import.meta.env.VITE_ADMIN_TOKEN;
  config.headers.Authorization = `Bearer ${adminToken}`;

  return config;
});

export default api;
