import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const api = axios.create({
  baseURL: API_URL
});
api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
export const submitLead = leadData => api.post("/leads", leadData);
export const getLeads = queryParams => api.get("/leads", {
  params: queryParams
});
export const getLeadById = id => api.get(`/leads/${id}`);
export const updateLeadStatus = (id, statusData) => api.put(`/leads/${id}/status`, statusData);
export const deleteLead = id => api.delete(`/leads/${id}`);
export const bookAppointment = appointmentData => api.post("/appointments", appointmentData);
export const getAppointments = () => api.get("/appointments");
export const updateAppointment = (id, data) => api.put(`/appointments/${id}`, data);
export const deleteAppointment = id => api.delete(`/appointments/${id}`);
export const getAvailability = date => api.get("/calendar/availability", {
  params: {
    date
  }
});
export const getCalendarExportUrl = id => `${API_URL}/calendar/export/${id}`;
export const loginRequest = credentials => api.post("/auth/login", credentials);
export const registerRequest = userData => api.post("/auth/register", userData);
export default api;
