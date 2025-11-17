export interface Ambulance {
  id?: number;
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
  id?: number;
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

export interface User {
  id?: number;
  email: string;
  password: string;
  role: 'admin' | 'user';
  name?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface LocationQuery {
  latitude?: number;
  longitude?: number;
  radius?: number; // in kilometers
}

export interface SearchQuery {
  search?: string; // search term for filtering
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
  role?: 'admin' | 'user';
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

export interface JwtPayload {
  userId: number;
  email: string;
  role: 'admin' | 'user';
}
