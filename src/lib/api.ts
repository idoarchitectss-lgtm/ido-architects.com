import axios from 'axios';

const getBaseUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/api`;
    }
    const baseUrl = process.env.AUTH_URL || process.env.NEXT_PUBLIC_APP_URL;
    if (baseUrl) return `${baseUrl}/api`;
    return '/api';
  }
  return 'http://localhost:3000/api';
};

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: { 'Content-Type': 'application/json' },
});

import type { AxiosResponse } from 'axios';

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: unknown) => Promise.reject(error),
);

export default api;
