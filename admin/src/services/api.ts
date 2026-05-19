import axios from "axios";

const isProduction = typeof window !== "undefined" && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (isProduction ? "https://aura-backend-v5sg.onrender.com/api" : "http://localhost:5000/api"),
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;