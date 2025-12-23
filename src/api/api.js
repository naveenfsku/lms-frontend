import axios from "axios";

const API = axios.create({
  baseURL: "https://lms-backend-v2g9.onrender.com/api/",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
