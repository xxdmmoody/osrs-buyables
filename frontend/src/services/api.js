import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('[API Error]', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

/**
 * Health check
 */
export async function checkHealth() {
  const response = await api.get('/health');
  return response.data;
}

/**
 * Get available skills
 */
export async function getSkills() {
  const response = await api.get('/skills');
  return response.data;
}

/**
 * Get buyables for a skill
 * @param {string} skill - Skill name (e.g., 'herblore')
 */
export async function getBuyables(skill) {
  const response = await api.get(`/buyables/${skill}`);
  return response.data;
}

/**
 * Get dashboard data with top items from each skill
 */
export async function getDashboard() {
  const response = await api.get('/dashboard');
  return response.data;
}

/**
 * Send a contact form submission
 * @param {FormData} formData - Multipart form data with name, email, subject, body, and optional screenshots
 */
export async function sendContactForm(formData) {
  const response = await api.post('/contact', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}

export default api;
