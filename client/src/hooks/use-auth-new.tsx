import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/lib/config";

// Types
export type UserData = {
  id: number;
  username: string;
  email: string;
  fullName?: string;
};

export type LoginData = {
  username: string;
  password: string;
};

export type RegisterData = {
  username: string;
  email: string;
  password: string;
  fullName?: string;
  phoneNumber?: string;
  profession?: string;
  referralSource?: string;
};

type AuthContextType = {
  user: UserData | null;
  isLoading: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
};

// API functions
async function apiRequest(method: string, endpoint: string, data?: any) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    console.log(`Making ${method} request to ${url}`);
    
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
      credentials: 'include',
    });
    
    console.log(`Response status: ${response.status}`);
    
    const responseData = await response.json();
    
    if (!response.ok) {
      throw new Error(responseData.error || `Request failed with status ${response.status}`);
    }
    
    return responseData;
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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  
  // Check for stored user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);
  
  // Login function
  const login = async (data: LoginData) => {
    setIsLoading(true);
    try {
      const userData = await apiRequest('POST', '/api/auth/login', data);
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      toast({
        title: "Login successful",
        description: `Welcome back, ${userData.username}!`,
      });
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
      const userData = await apiRequest('POST', '/api/auth/register', data);
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      toast({
        title: "Registration successful",
        description: `Welcome to CodeLearn, ${userData.username}!`,
      });
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
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };
  
  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
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