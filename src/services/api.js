const API_BASE = '/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('glowwear_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers
  };

  const config = {
    ...options,
    headers
  };

  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }

  const res = await fetch(`${API_BASE}${endpoint}`, config);
  const data = await res.json().catch(() => ({ success: false, message: 'Invalid response from server.' }));

  if (!res.ok) {
    const errorMsg = data && data.message ? data.message : `Request failed with status ${res.status}`;
    const error = new Error(errorMsg);
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  // Auth
  register: (name, email, password) => request('/auth/register', { method: 'POST', body: { name, email, password } }),
  login: (email, password) => request('/auth/login', { method: 'POST', body: { email, password } }),
  getMe: () => request('/auth/me'),
  updateProfile: (profileData) => request('/auth/profile', { method: 'PUT', body: profileData }),
  changePassword: (currentPassword, newPassword) => request('/auth/change-password', { method: 'PUT', body: { currentPassword, newPassword } }),
  forgotPassword: (email) => request('/auth/forgot-password', { method: 'POST', body: { email } }),
  resetPassword: (email, newPassword) => request('/auth/reset-password', { method: 'POST', body: { email, newPassword } }),

  // Collections
  getCollections: () => request('/collections'),
  getCollection: (id) => request(`/collections/${id}`),
  createCollection: (colData) => request('/collections', { method: 'POST', body: colData }),
  updateCollection: (id, updates) => request(`/collections/${id}`, { method: 'PUT', body: updates }),
  deleteCollection: (id) => request(`/collections/${id}`, { method: 'DELETE' }),

  // Products
  getProducts: (params = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') searchParams.append(k, v);
    });
    const qs = searchParams.toString();
    return request(`/products${qs ? '?' + qs : ''}`);
  },
  getMetrics: () => request('/products/metrics'),
  checkDuplicate: (url) => request('/products/check-duplicate', { method: 'POST', body: { url } }),
  createProduct: (productData) => request('/products', { method: 'POST', body: productData }),
  updateProduct: (id, updates) => request(`/products/${id}`, { method: 'PUT', body: updates }),
  deleteProduct: (id) => request(`/products/${id}`, { method: 'DELETE' }),

  // Scraping / Universal extraction
  extractUrlMetadata: (url) => request('/scrape/extract', { method: 'POST', body: { url } }),

  // Public Collections
  getSharedCollection: (shareId) => request(`/public/collections/${shareId}`),

  // Admin
  getAdminAnalytics: () => request('/admin/analytics'),
  getAdminUsers: () => request('/admin/users')
};

export default api;
