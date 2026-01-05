/**
 * API Service for Startify AI
 * Centralized API communication using axios
 */

import axios from 'axios'

// Base API URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60 seconds for long-running AI tasks
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for adding auth tokens
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error
      console.error('API Error:', error.response.data)
      
      if (error.response.status === 401) {
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem('auth_token')
        // window.location.href = '/login'
      }
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', error.request)
    } else {
      // Something else happened
      console.error('Error:', error.message)
    }
    return Promise.reject(error)
  }
)

// API Methods
const api = {
  // Health check
  healthCheck: () => apiClient.get('/health'),

  // Idea Generation Workflow
  generateIdea: (email, idea) => 
    apiClient.post('/api/generate', { email, idea }),

  getJobStatus: (jobId) => 
    apiClient.get(`/api/status/${jobId}`),

  downloadPackage: (jobId) => 
    apiClient.get(`/api/download/${jobId}`),

  getJobResults: (jobId) => 
    apiClient.get(`/api/results/${jobId}`),

  // Individual Module Endpoints (for future expansion)
  parseIdea: (ideaText) => 
    apiClient.post('/api/parse-idea', { idea_text: ideaText }),

  runResearch: (parsedIdea) => 
    apiClient.post('/api/research', parsedIdea),

  generateBranding: (parsedIdea, researchResults) => 
    apiClient.post('/api/branding', { parsed_idea: parsedIdea, research: researchResults }),

  generatePitchDeck: (data) => 
    apiClient.post('/api/pitchdeck', data),

  // User Management
  getUserProjects: (email) => 
    apiClient.get(`/api/user/projects?email=${email}`),

  // File Downloads
  downloadFile: (jobId, filename) => 
    apiClient.get(`/files/${jobId}/${filename}`, {
      responseType: 'blob'
    }),
}

export default api
export { API_BASE_URL }