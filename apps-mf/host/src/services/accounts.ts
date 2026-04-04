import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API_URL = 'http://localhost:8000/api';

export interface Account {
  id: number;
  user_id: number;
  type: string;
  provider: string | null;
  account_number: string | null;
  balance: string;
  status: string;
  created_at: string;
  updated_at: string;
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

const accountsApi = {
  getAll: async (): Promise<Account[]> => {
    console.log('API Request: GET /accounts');
    const response = await fetch(`${API_URL}/accounts`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    const data = (await handleResponse(response)) as { accounts: Account[] };
    return data.accounts;
  },

  getOne: async (id: number): Promise<Account> => {
    console.log('API Request: GET /accounts/:id', id);
    const response = await fetch(`${API_URL}/accounts/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    const data = (await handleResponse(response)) as { account: Account };
    return data.account;
  },

  create: async (account: Partial<Account>): Promise<Account> => {
    console.log('API Request: POST /accounts', account);
    const response = await fetch(`${API_URL}/accounts`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(account),
    });
    const data = (await handleResponse(response)) as { account: Account };
    return data.account;
  },

  update: async (id: number, account: Partial<Account>): Promise<Account> => {
    console.log('API Request: PUT /accounts/:id', id, account);
    const response = await fetch(`${API_URL}/accounts/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(account),
    });
    const data = (await handleResponse(response)) as { account: Account };
    return data.account;
  },

  delete: async (id: number): Promise<void> => {
    console.log('API Request: DELETE /accounts/:id', id);
    const response = await fetch(`${API_URL}/accounts/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    await handleResponse(response);
  },
};

export const useAccounts = () => {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: () => accountsApi.getAll(),
  });
};

export const useAccount = (id: number) => {
  return useQuery({
    queryKey: ['accounts', id],
    queryFn: () => accountsApi.getOne(id),
    enabled: !!id,
  });
};

export const useCreateAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (account: Partial<Account>) => accountsApi.create(account),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });
};

export const useUpdateAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, account }: { id: number; account: Partial<Account> }) =>
      accountsApi.update(id, account),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });
};

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => accountsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });
};

export default accountsApi;