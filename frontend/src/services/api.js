import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const SERVER_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, '');
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Attach JWT Token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('civic_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor: Handle Unauthorized / Global Errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if expired or invalid
      // localStorage.removeItem('civic_token');
      // localStorage.removeItem('civic_user');
    }
    return Promise.reject(error);
  }
);

// API Endpoints
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.post('/auth/change-password', data),
  getUserActivity: () => api.get('/auth/activity'),
};

export const complaintAPI = {
  getComplaints: (params) => api.get('/complaints', { params }),
  getComplaintById: (id) => api.get(`/complaints/${id}`),
  createComplaint: (formData) =>
    api.post('/complaints', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  updateStatus: (id, formData) =>
    api.patch(`/complaints/${id}/status`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  assignComplaint: (id, data) => api.patch(`/complaints/${id}/assign`, data),
  overridePriority: (id, data) => api.patch(`/complaints/${id}/priority`, data),
};

export const pickupAPI = {
  getPickups: (params) => api.get('/pickups', { params }),
  getPickupById: (id) => api.get(`/pickups/${id}`),
  createPickup: (formData) =>
    api.post('/pickups', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  scheduleAndAssign: (id, data) => api.patch(`/pickups/${id}/schedule`, data),
  updateStatus: (id, data) => api.patch(`/pickups/${id}/status`, data),
};

export const listingAPI = {
  getListings: (params) => api.get('/listings', { params }),
  getListingById: (id) => api.get(`/listings/${id}`),
  createListing: (formData) =>
    api.post('/listings', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  requestItem: (id, data) => api.post(`/listings/${id}/request`, data),
  respondToRequest: (id, requestId, data) =>
    api.patch(`/listings/${id}/requests/${requestId}`, data),
  deleteListing: (id) => api.delete(`/listings/${id}`),
};

export const recyclingAPI = {
  getCentres: (params) => api.get('/recycling', { params }),
  getCentreById: (id) => api.get(`/recycling/${id}`),
  createCentre: (data) => api.post('/recycling', data),
  updateCentre: (id, data) => api.put(`/recycling/${id}`, data),
  deleteCentre: (id) => api.delete(`/recycling/${id}`),
};

export const educationAPI = {
  getContent: (params) => api.get('/education', { params }),
  takeQuiz: (data) => api.post('/education/quiz', data),
  createTopic: (data) => api.post('/education', data),
  updateTopic: (id, data) => api.put(`/education/${id}`, data),
  deleteTopic: (id) => api.delete(`/education/${id}`),
};

export const assistantAPI = {
  askAssistant: (data) => api.post('/assistant/ask', data),
  getSuggestions: () => api.get('/assistant/suggestions'),
};

export const pointsAPI = {
  getMyPoints: () => api.get('/points/my'),
  getLeaderboard: (params) => api.get('/points/leaderboard', { params }),
  getRules: () => api.get('/points/rules'),
};

export const notificationAPI = {
  getNotifications: () => api.get('/notifications'),
  markAsRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllAsRead: () => api.patch('/notifications/read-all'),
};

export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (params) => api.get('/admin/users', { params }),
  updateUserRole: (id, data) => api.patch(`/admin/users/${id}/role`, data),
  getServiceTeam: () => api.get('/admin/service-team'),
};

export default api;
