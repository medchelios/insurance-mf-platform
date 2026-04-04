import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API_URL = 'http://localhost:8000/api';

export interface Claim {
  id: number;
  user_id: number;
  type: string;
  status: string;
  description: string | null;
  incident_date: string | null;
  estimated_amount: string | null;
  notes: string | null;
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

const claimsApi = {
  getAll: async (): Promise<Claim[]> => {
    console.log('API Request: GET /claims');
    const response = await fetch(`${API_URL}/claims`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    const data = (await handleResponse(response)) as { claims: Claim[] };
    return data.claims;
  },

  getOne: async (id: number): Promise<Claim> => {
    console.log('API Request: GET /claims/:id', id);
    const response = await fetch(`${API_URL}/claims/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    const data = (await handleResponse(response)) as { claim: Claim };
    return data.claim;
  },

  create: async (claim: Partial<Claim>): Promise<Claim> => {
    console.log('API Request: POST /claims', claim);
    const response = await fetch(`${API_URL}/claims`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(claim),
    });
    const data = (await handleResponse(response)) as { claim: Claim };
    return data.claim;
  },

  update: async (id: number, claim: Partial<Claim>): Promise<Claim> => {
    console.log('API Request: PUT /claims/:id', id, claim);
    const response = await fetch(`${API_URL}/claims/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(claim),
    });
    const data = (await handleResponse(response)) as { claim: Claim };
    return data.claim;
  },

  delete: async (id: number): Promise<void> => {
    console.log('API Request: DELETE /claims/:id', id);
    const response = await fetch(`${API_URL}/claims/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    await handleResponse(response);
  },
};

export const useClaims = () => {
  return useQuery({
    queryKey: ['claims'],
    queryFn: () => claimsApi.getAll(),
  });
};

export const useClaim = (id: number) => {
  return useQuery({
    queryKey: ['claims', id],
    queryFn: () => claimsApi.getOne(id),
    enabled: !!id,
  });
};

export const useCreateClaim = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (claim: Partial<Claim>) => claimsApi.create(claim),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['claims'] });
    },
  });
};

export const useUpdateClaim = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, claim }: { id: number; claim: Partial<Claim> }) =>
      claimsApi.update(id, claim),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['claims'] });
    },
  });
};

export const useDeleteClaim = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => claimsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['claims'] });
    },
  });
};

export default claimsApi;