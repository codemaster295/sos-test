import axios from 'axios';
import { Ambulance, Doctor, PaginatedResponse, LoginRequest, RegisterRequest, AuthResponse, User } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      error.message = 'Request timeout - please check if the backend is running';
    } else if (error.response) {
      // Server responded with error status
      error.message = error.response.data?.error || error.message;
    } else if (error.request) {
      // Request made but no response received
      error.message = 'No response from server - please check if the backend is running on http://localhost:3001';
    }
    return Promise.reject(error);
  }
);

// Ambulance APIs
export const ambulanceApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    latitude?: number;
    longitude?: number;
    radius?: number;
    search?: string;
  }): Promise<PaginatedResponse<Ambulance>> => {
    const response = await api.get<PaginatedResponse<Ambulance>>('/ambulances', { params });
    return response.data;
  },

  getById: async (id: number): Promise<Ambulance> => {
    const response = await api.get<Ambulance>(`/ambulances/${id}`);
    return response.data;
  },

  create: async (ambulance: Omit<Ambulance, 'id' | 'createdAt' | 'updatedAt'>): Promise<Ambulance> => {
    const response = await api.post<Ambulance>('/ambulances', ambulance);
    return response.data;
  },

  update: async (id: number, ambulance: Partial<Ambulance>): Promise<Ambulance> => {
    const response = await api.put<Ambulance>(`/ambulances/${id}`, ambulance);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/ambulances/${id}`);
  },
};

// Doctor APIs
export const doctorApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    latitude?: number;
    longitude?: number;
    radius?: number;
    search?: string;
  }): Promise<PaginatedResponse<Doctor>> => {
    const response = await api.get<PaginatedResponse<Doctor>>('/doctors', { params });
    return response.data;
  },

  getById: async (id: number): Promise<Doctor> => {
    const response = await api.get<Doctor>(`/doctors/${id}`);
    return response.data;
  },

  create: async (doctor: Omit<Doctor, 'id' | 'createdAt' | 'updatedAt'>): Promise<Doctor> => {
    const response = await api.post<Doctor>('/doctors', doctor);
    return response.data;
  },

  update: async (id: number, doctor: Partial<Doctor>): Promise<Doctor> => {
    const response = await api.put<Doctor>(`/doctors/${id}`, doctor);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/doctors/${id}`);
  },
};

// Auth APIs
export const authApi = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', userData);
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },
};

export default api;

