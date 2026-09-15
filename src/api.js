import { initData } from './telegram';

const BASE = import.meta.env.VITE_API_URL || 'https://gebeya-tech-backend.onrender.com';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-Init-Data': initData(),
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }

  return res.json();
}

export const api = {
  // ---- Products & catalog ----
  products: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/api/products${q ? '?' + q : ''}`);
  },
  product: (id) => request(`/api/products/${id}`),
  categories: () => request('/api/categories'),

  // ---- Admin: create/update/delete products ----
  createProduct: (payload) =>
    request('/api/products', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateProduct: (id, payload) =>
    request(`/api/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  deleteProduct: (id) =>
    request(`/api/products/${id}`, { method: 'DELETE' }),

  // ---- Image upload (returns { url }) ----
  uploadImage: async (file) => {
    const form = new FormData();
    form.append('file', file);

    const res = await fetch(`${BASE}/api/uploads`, {
      method: 'POST',
      headers: { 'X-Init-Data': initData() },
      body: form,
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `Upload failed: ${res.status}`);
    }
    return res.json();
  },

  // ---- Orders ----
  createOrder: (payload) =>
    request('/api/orders', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  myOrders: () => request('/api/orders'),
  allOrders: () => request('/api/orders/all'),
  setOrderStatus: (id, status) =>
    request(`/api/orders/${id}/status?status=${status}`, { method: 'PUT' }),
};

export const API_BASE = BASE;