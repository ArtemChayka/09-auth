import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL
  ? process.env.NEXT_PUBLIC_API_URL + '/api'
  : 'https://notehub-api.goit.study';

export const apiInstance = axios.create({
  baseURL,
  withCredentials: true,
});

apiInstance.defaults.headers.common['Content-Type'] = 'application/json';

apiInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  },
);
