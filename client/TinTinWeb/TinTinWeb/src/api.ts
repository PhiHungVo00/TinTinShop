export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

export interface LoginResponse {
  access_token: string;
  user: {
    id: number;
    userName: string;
    email: string;
    role?: {
      id: number;
      name: string;
    };
  };
}

export async function login(username: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  if (!res.ok) {
    throw new Error('Login failed');
  }
  return res.json();
}

export async function fetchProducts(token: string) {
  const res = await fetch(`${API_URL}/products`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export async function fetchOrders(token: string) {
  const res = await fetch(`${API_URL}/orders`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch orders');
  return res.json();
}
