import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/lib/config";

// Types
export interface UserData {
  id: number;
  username: string;
  email: string;
  fullName?: string;
  profession?: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  fullName?: string;
  phoneNumber?: string;
  profession?: string;
  referralSource?: string;
}

export interface AuthResponse {
  user: UserData;
  token: string;
}

interface AuthContextType {
  user: UserData | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

// API functions
async function apiRequest<T>(method: string, endpoint: string, data?: any): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem('token');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  try {
    console.log(`Making ${method} request to ${url}`);
    
    const response = await fetch(url, {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
      credentials: 'include',
    });
    
    const responseData = await response.json();
    
    if (!response.ok) {
      throw new Error(responseData.error || `Request failed with status ${response.status}`);
    }
    
    return responseData as T;
  } catch (error) {
    console.error(`API request error (${method} ${endpoint}):`, error);
    throw error;
  }
}

// Create context
const AuthContext = createContext<AuthContextType | null>(null);

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Check for stored token on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      
      // Fetch user data with the token
      apiRequest<{ user: UserData }>('GET', '/api/auth/me')
        .then(data => {
          setUser(data.user);
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
          // If token is invalid, clear it
          localStorage.removeItem('token');
          setToken(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);
  
  // Login function
  const login = async (data: LoginData) => {
    setIsLoading(true);
    try {
      const response = await apiRequest<AuthResponse>('POST', '/api/auth/login', data);
      
      // Save token and user data
      localStorage.setItem('token', response.token);
      setToken(response.token);
      setUser(response.user);
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${response.user.username}!`,
      });
      
      // Invalidate queries that might depend on authentication
      queryClient.invalidateQueries();
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Register function
  const register = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      const response = await apiRequest<AuthResponse>('POST', '/api/auth/register', data);
      
      // Save token and user data
      localStorage.setItem('token', response.token);
      setToken(response.token);
      setUser(response.user);
      
      toast({
        title: "Registration successful",
        description: `Welcome to CodeLearn, ${response.user.username}!`,
      });
      
      // Invalidate queries that might depend on authentication
      queryClient.invalidateQueries();
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "Please check your information and try again",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Logout function
  const logout = async () => {
    try {
      // Call logout endpoint
      await apiRequest('POST', '/api/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage and state
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      
      // Invalidate queries that might depend on authentication
      queryClient.invalidateQueries();
      
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
    }
  };
  
  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        token, 
        isLoading, 
        isAuthenticated: !!user, 
        login, 
        register, 
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}