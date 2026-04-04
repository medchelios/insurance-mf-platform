const API_URL = 'http://localhost:8000/api';

const getAuthHeaders = () => {
  const headers = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('auth_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (response) => {
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

export const authApi = {
  login: async (email, password) => {
    console.log('API Request: POST /login', { email });
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ email, password }),
    });
    const data = await handleResponse(response);
    if (data.token) {
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('auth_user', JSON.stringify(data.user));
    }
    return data;
  },

  register: async (name, email, password, passwordConfirmation) => {
    console.log('API Request: POST /register', { name, email });
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ name, email, password, password_confirmation: passwordConfirmation }),
    });
    const data = await handleResponse(response);
    if (data.token) {
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('auth_user', JSON.stringify(data.user));
    }
    return data;
  },

  logout: async () => {
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

  me: async () => {
    console.log('API Request: GET /me');
    const response = await fetch(`${API_URL}/me`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

export default null;