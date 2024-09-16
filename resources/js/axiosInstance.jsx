// resources/js/axiosInstance.js

import axios from 'axios';
import { Inertia } from '@inertiajs/inertia';

// Membuat instance axios
const axiosInstance = axios.create({
  baseURL: '/api', // Ganti dengan URL dasar API Anda
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
});

const token = document.head.querySelector('meta[name="csrf-token"]');

if (token) {
  axiosInstance.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
} else {
  console.error('CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token');
}

// Interceptor untuk menangani response dan error
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Arahkan ke halaman login jika unauthorized
      Inertia.visit('/login');
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
