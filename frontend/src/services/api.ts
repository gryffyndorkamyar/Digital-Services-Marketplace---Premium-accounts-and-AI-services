const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Helper function for API calls
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('token');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

// Auth API
export const authAPI = {
  login: (username: string, password: string) =>
    apiCall<{ token: string; user: any }>('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
  
  logout: () =>
    apiCall('/auth/logout/', {
      method: 'POST',
    }),
};

// Categories API
export const categoriesAPI = {
  getAll: () => apiCall<any[]>('/categories/'),
  getById: (id: string) => apiCall<any>(`/categories/${id}/`),
  getFeatured: () => apiCall<any[]>('/categories/featured/'),
  getTree: () => apiCall<any>('/categories/tree/'),
  getProducts: (id: string) => apiCall<any[]>(`/categories/${id}/products/`),
};

// Products API
export const productsAPI = {
  getAll: () => apiCall<any[]>('/products/'),
  getById: (id: string) => apiCall<any>(`/products/${id}/`),
  getFeatured: () => apiCall<any[]>('/products/featured/'),
  getTrending: () => apiCall<any[]>('/products/trending/'),
  getNew: () => apiCall<any[]>('/products/new/'),
  getBestsellers: () => apiCall<any[]>('/products/bestsellers/'),
  getOnSale: () => apiCall<any[]>('/products/on_sale/'),
  search: (query: string) => apiCall<any[]>(`/products/search/?q=${query}`),
  getRelated: (id: string) => apiCall<any[]>(`/products/${id}/related/`),
};

// Cart API
export const cartAPI = {
  getAll: () => apiCall<any[]>('/carts/'),
  getActive: () => apiCall<any>('/carts/active/'),
  getById: (id: string) => apiCall<any>(`/carts/${id}/`),
  create: (data: any) =>
    apiCall<any>('/carts/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  addItem: (id: string, data: any) =>
    apiCall<any>(`/carts/${id}/add_item/`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  removeItem: (id: string, data: any) =>
    apiCall<any>(`/carts/${id}/remove_item/`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateItem: (id: string, data: any) =>
    apiCall<any>(`/carts/${id}/update_item/`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  clear: (id: string) =>
    apiCall<any>(`/carts/${id}/clear/`, {
      method: 'POST',
    }),
  applyCoupon: (id: string, code: string) =>
    apiCall<any>(`/carts/${id}/apply_coupon/`, {
      method: 'POST',
      body: JSON.stringify({ code }),
    }),
};

// Orders API
export const ordersAPI = {
  getAll: () => apiCall<any[]>('/orders/'),
  getById: (id: string) => apiCall<any>(`/orders/${id}/`),
  create: (data: any) =>
    apiCall<any>('/orders/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  cancel: (id: string) =>
    apiCall<any>(`/orders/${id}/cancel/`, {
      method: 'POST',
    }),
  processPayment: (id: string, data: any) =>
    apiCall<any>(`/orders/${id}/process_payment/`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getItemContent: (orderId: string, itemId: string) =>
    apiCall<any>(`/orders/${orderId}/items/${itemId}/content/`),
};

// Users API
export const usersAPI = {
  getMe: () => apiCall<any>('/users/me'),
  updateMe: (data: any) =>
    apiCall<any>('/users/update_me/', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  getProfile: () => apiCall<any>('/users/profile'),
  updateProfile: (data: any) =>
    apiCall<any>('/users/update_profile/', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return apiCall<any>('/users/upload_avatar/', {
      method: 'POST',
      headers: {},
      body: formData,
    });
  },
};

// Reviews API
export const reviewsAPI = {
  getAll: () => apiCall<any[]>('/reviews/'),
  getById: (id: string) => apiCall<any>(`/reviews/${id}/`),
  create: (data: any) =>
    apiCall<any>('/reviews/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: any) =>
    apiCall<any>(`/reviews/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiCall<any>(`/reviews/${id}/`, {
      method: 'DELETE',
    }),
  markHelpful: (id: string) =>
    apiCall<any>(`/reviews/${id}/helpful/`, {
      method: 'POST',
    }),
  markNotHelpful: (id: string) =>
    apiCall<any>(`/reviews/${id}/not_helpful/`, {
      method: 'POST',
    }),
};

export default {
  authAPI,
  categoriesAPI,
  productsAPI,
  cartAPI,
  ordersAPI,
  usersAPI,
  reviewsAPI,
};

