import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const API_URL = 'http://localhost:8000/api';

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

const getAuthHeaders = (): HeadersInit => {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('auth_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (response: Response): Promise<unknown> => {
  const data = await response.json();
  console.log('API Response:', response.status, data);

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      window.location.href = '/login';
    }
    throw new Error(data.message || 'API Error');
  }

  return data;
};

const authApi = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    console.log('API Request: POST /login', { email });
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ email, password }),
    });
    const data = (await handleResponse(response)) as AuthResponse;
    if (data.token) {
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('auth_user', JSON.stringify(data.user));
    }
    return data;
  },

  register: async (name: string, email: string, password: string, passwordConfirmation: string): Promise<AuthResponse> => {
    console.log('API Request: POST /register', { name, email });
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ name, email, password, password_confirmation: passwordConfirmation }),
    });
    const data = (await handleResponse(response)) as AuthResponse;
    if (data.token) {
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('auth_user', JSON.stringify(data.user));
    }
    return data;
  },

  logout: async (): Promise<void> => {
    console.log('API Request: POST /logout');
    try {
      const response = await fetch(`${API_URL}/logout`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      await handleResponse(response);
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    }
  },

  me: async (): Promise<User> => {
    console.log('API Request: GET /me');
    const response = await fetch(`${API_URL}/me`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return (await handleResponse(response)) as User;
  },
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authApi.login(email, password),
    onSuccess: (data) => {
      queryClient.setQueryData(['user'], data.user);
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ name, email, password, passwordConfirmation }: { name: string; email: string; password: string; passwordConfirmation: string }) =>
      authApi.register(name, email, password, passwordConfirmation),
    onSuccess: (data) => {
      queryClient.setQueryData(['user'], data.user);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      queryClient.clear();
    },
  });
};

export const useUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: () => authApi.me(),
    enabled: !!localStorage.getItem('auth_token'),
  });
};

export default authApi;