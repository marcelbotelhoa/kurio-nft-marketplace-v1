// src/lib/api.ts
import axios from 'axios';

export const api = axios.create({
  baseURL: '/',
});

// Interceptor para adicionar o token nas requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@kurio:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para lidar com sessão expirada (401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config.url.includes('/auth/login')) {
      localStorage.removeItem('@kurio:token');
      // Opcional: Redirecionar para o login ou emitir um evento
      window.dispatchEvent(new Event('auth:expired'));
    }
    return Promise.reject(error);
  }
);