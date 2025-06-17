import axios from 'axios';

// Creamos la instancia base
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080',
});

// Interceptor de request para agregar el token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');  // Donde guardas el JWT
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;