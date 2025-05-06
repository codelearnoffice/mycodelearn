import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { API_BASE_URL } from './config';

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    let errorMessage = res.statusText;
    try {
      const text = await res.text();
      if (text) {
        try {
          // Try to parse as JSON
          const json = JSON.parse(text);
          errorMessage = json.error || json.message || text;
        } catch {
          // If not JSON, use as is
          errorMessage = text;
        }
      }
    } catch (e) {
      console.error("Error parsing response:", e);
    }
    
    console.error(`API Error ${res.status}: ${errorMessage}`);
    throw new Error(`${res.status}: ${errorMessage}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  try {
    const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
    console.log(`Making ${method} request to ${fullUrl}`);
    
    const res = await fetch(fullUrl, {
      method,
      headers: data ? { "Content-Type": "application/json" } : {},
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include",
    });

    console.log(`Response status: ${res.status} ${res.statusText}`);
    
    // For registration and login, we want to handle the response in the mutation function
    // so we don't throw an error here for these specific endpoints
    if (url.includes('/api/auth/register') || url.includes('/api/auth/login')) {
      return res;
    }
    
    await throwIfResNotOk(res);
    return res;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`API Request Error (${method} ${url}):`, error.message);
    } else {
      console.error(`Unknown API Request Error (${method} ${url}):`, error);
    }
    throw error;
  }
}





type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    try {
      const path = queryKey[0] as string;
      const fullUrl = path.startsWith('http') ? path : `${API_BASE_URL}${path}`;
      console.log(`Making GET request to ${fullUrl}`);
      
      const token = localStorage.getItem('token');
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const res = await fetch(fullUrl, {
        credentials: "include",
        headers,
      });
      
      console.log(`Response status: ${res.status} ${res.statusText}`);

      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        console.log("Unauthorized request, returning null as configured");
        return null;
      }

      await throwIfResNotOk(res);
      return await res.json();
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Query Error (${queryKey[0]}):`, error.message);
      } else {
        console.error(`Unknown Query Error (${queryKey[0]}):`, error);
      }
      throw error;
    }
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});
