import axios, { AxiosError, AxiosResponse } from 'axios';
import { Inertia } from '@inertiajs/inertia';

// Define the axios instance
const axiosInstance = axios.create({
  baseURL: '/', // Change this to your API base URL
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json',
  },
});

// Fetch the CSRF token from the meta tag
const token = document.head.querySelector<HTMLMetaElement>('meta[name="csrf-token"]');

if (token) {
  axiosInstance.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
} else {
  console.error('CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token');
}

// Interceptor to handle response and error
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response && error.response.status === 401) {
      // Redirect to login page if unauthorized
      Inertia.visit('/login');
    }
    return Promise.reject(error);
  },
);

// Export the axios instance
export default axiosInstance;
