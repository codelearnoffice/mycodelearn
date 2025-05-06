export const API_BASE_URL = "http://localhost:3000";

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  email: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
}