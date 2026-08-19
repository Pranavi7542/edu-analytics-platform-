import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
});

// Attach the JWT (if present) to every request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const login = (email, password) => api.post("/auth/login", { email, password });
export const register = (data) => api.post("/auth/register", data);

export const getStudentPerformance = (studentId) => api.get(`/students/${studentId}/performance`);
export const listStudents = () => api.get("/students");
export const addAssessment = (studentId, data) => api.post(`/students/${studentId}/assessments`, data);

export const listCourses = () => api.get("/courses");

export const listAlerts = () => api.get("/alerts");
export const resolveAlert = (alertId) => api.patch(`/alerts/${alertId}/resolve`);

export default api;
