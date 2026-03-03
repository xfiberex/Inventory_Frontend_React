import axios from 'axios';

// Instancia base de Axios
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5284/api',
  headers: {
    'Content-Type': 'application/json',
  },
  // Si añades auth más adelante en ASP.NET:
  // withCredentials: true,
});

export default api;