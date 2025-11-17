export interface Ambulance {
  id: number;
  title: string;
  description: string;
  location: string;
  latitude: number;
  longitude: number;
  image?: string;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Doctor {
  id: number;
  title: string;
  description: string;
  location: string;
  latitude: number;
  longitude: number;
  image?: string;
  phone?: string;
  specialization?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface LocationState {
  latitude: number | null;
  longitude: number | null;
  address: string | null;
  error: string | null;
  loading: boolean;
}

export type ResourceType = 'ambulances' | 'doctors';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    email: string;
    role: 'admin' | 'user';
    name?: string;
  };
}

export interface User {
  id: number;
  email: string;
  role: 'admin' | 'user';
  name?: string;
}

