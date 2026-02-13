import axios from "axios";

// Use environment variable for production, fallback to localhost for development
const baseURL = "https://cetup-finale.onrender.com/api";

const api = axios.create({
  baseURL: baseURL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;