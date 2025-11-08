import { authTokenStore } from './authToken';
export const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Helper function for API calls
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = authTokenStore.get();
  const isFormData = options.body instanceof FormData;

  const headers: HeadersInit = {
    ...(token && { Authorization: token }),
    ...(!isFormData && { 'Content-Type': 'application/json' }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: options.credentials ?? 'include',
  });

  let data: any = null;
  const text = await response.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch (error) {
      data = text;
    }
  }

  if (!response.ok) {
    const message =
      (data && typeof data === 'object' && !Array.isArray(data) &&
        (data.detail || data.error || Object.values(data)[0])) ||
      (typeof data === 'string' ? data : response.statusText || 'خطای ناشناخته');
    const error = new Error(`API Error: ${message}`) as Error & { status?: number; payload?: any };
    error.status = response.status;
    error.payload = data;
    throw error;
  }

  return data as T;
}

const extractList = <T>(data: any): T[] => {
  if (Array.isArray(data)) return data as T[];
  if (data && Array.isArray(data.results)) return data.results as T[];
  if (data && Array.isArray(data.data)) return data.data as T[];
  if (data && Array.isArray(data.items)) return data.items as T[];
  return [] as T[];
};

// Auth API
export const authAPI = {
  login: (username: string, password: string) =>
    apiCall<any>('/auth/login/', {
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
  getAll: async <T = any>() => extractList<T>(await apiCall<any>('/categories/')),
  getById: (id: string) => apiCall<any>(`/categories/${id}/`),
  getFeatured: async <T = any>() => extractList<T>(await apiCall<any>('/categories/featured/')),
  getTree: () => apiCall<any>('/categories/tree/'),
  getProducts: async <T = any>(id: string) => extractList<T>(await apiCall<any>(`/categories/${id}/products/`)),
};

// Products API
export const productsAPI = {
  getAll: async <T = any>() => extractList<T>(await apiCall<any>('/products/')),
  getById: (id: string) => apiCall<any>(`/products/${id}/`),
  getFeatured: async <T = any>() => extractList<T>(await apiCall<any>('/products/featured/')),
  getTrending: async <T = any>() => extractList<T>(await apiCall<any>('/products/trending/')),
  getNew: async <T = any>() => extractList<T>(await apiCall<any>('/products/new/')),
  getBestsellers: async <T = any>() => extractList<T>(await apiCall<any>('/products/bestsellers/')),
  getOnSale: async <T = any>() => extractList<T>(await apiCall<any>('/products/on_sale/')),
  search: async <T = any>(query: string) => extractList<T>(await apiCall<any>(`/products/search/?q=${query}`)),
  getRelated: async <T = any>(id: string) => extractList<T>(await apiCall<any>(`/products/${id}/related/`)),
};

// Cart API
export const cartAPI = {
  getAll: async <T = any>() => extractList<T>(await apiCall<any>('/carts/')),
  getActive: () => apiCall<any>('/carts/active/'),
  getById: (id: string) => apiCall<any>(`/carts/${id}/`),
  create: (data: any = {}) =>
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
  getAll: async <T = any>() => extractList<T>(await apiCall<any>('/orders/')),
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
  register: (data: { username: string; email: string; phone?: string; phone_number?: string; password: string; password_confirm?: string }) =>
    apiCall<any>('/users/', {
      method: 'POST',
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
  getAll: async <T = any>() => extractList<T>(await apiCall<any>('/reviews/')),
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

