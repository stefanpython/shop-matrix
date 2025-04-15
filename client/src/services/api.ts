/* eslint-disable @typescript-eslint/no-explicit-any */
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Helper function for making API requests
export const apiRequest = async (
  endpoint: string,
  method: string = "GET",
  data: any = null,
  token: string | null = null
) => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method,
    headers,
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  const response = await fetch(`${API_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Something went wrong");
  }

  return response.json();
};

// Auth services
export const authService = {
  login: (credentials: { email: string; password: string }) =>
    apiRequest("/api/users/login", "POST", credentials),

  register: (userData: { name: string; email: string; password: string }) =>
    apiRequest("/api/users", "POST", userData),

  getUserProfile: (token: string) =>
    apiRequest("/api/users/profile", "GET", null, token),

  updateUserProfile: (userData: any, token: string) =>
    apiRequest("/api/users/profile", "PUT", userData, token),
};

// Product services
export const productService = {
  getProducts: (params: any = {}) => {
    const queryParams = new URLSearchParams();

    if (params.keyword) queryParams.append("keyword", params.keyword);
    if (params.pageNumber)
      queryParams.append("pageNumber", params.pageNumber.toString());
    if (params.category) queryParams.append("category", params.category);
    if (params.brand) queryParams.append("brand", params.brand);
    if (params.priceMin)
      queryParams.append("priceMin", params.priceMin.toString());
    if (params.priceMax)
      queryParams.append("priceMax", params.priceMax.toString());
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);

    return apiRequest(`/api/products?${queryParams.toString()}`);
  },

  getProductById: (id: string) => apiRequest(`/api/products/${id}`),

  getTopProducts: () => apiRequest("/api/products/top"),

  getFeaturedProducts: (count: number = 8) =>
    apiRequest(`/api/products/featured?count=${count}`),

  createProductReview: (productId: string, reviewData: any, token: string) =>
    apiRequest(`/api/products/${productId}/reviews`, "POST", reviewData, token),
};

// Category services
export const categoryService = {
  getCategories: () => apiRequest("/api/categories"),

  getCategoryById: (id: string) => apiRequest(`/api/categories/${id}`),
};

// Cart services
export const cartService = {
  getCart: (token: string) => apiRequest("/api/cart", "GET", null, token),

  addToCart: (
    productData: { productId: string; quantity: number; attributes?: any },
    token: string
  ) => apiRequest("/api/cart", "POST", productData, token),

  updateCartItem: (
    itemId: string,
    updateData: { quantity?: number; attributes?: any },
    token: string
  ) => apiRequest(`/api/cart/${itemId}`, "PUT", updateData, token),

  removeCartItem: (itemId: string, token: string) =>
    apiRequest(`/api/cart/${itemId}`, "DELETE", null, token),

  clearCart: (token: string) => apiRequest("/api/cart", "DELETE", null, token),
};

// Order services
export const orderService = {
  createOrder: (orderData: any, token: string) =>
    apiRequest("/api/orders", "POST", orderData, token),

  getOrderById: (id: string, token: string) =>
    apiRequest(`/api/orders/${id}`, "GET", null, token),

  updateOrderToPaid: (id: string, paymentResult: any, token: string) =>
    apiRequest(`/api/orders/${id}/pay`, "PUT", paymentResult, token),

  getMyOrders: (token: string) =>
    apiRequest("/api/orders/myorders", "GET", null, token),
};

// Address services
export const addressService = {
  getAddresses: (token: string) =>
    apiRequest("/api/addresses", "GET", null, token),

  getAddressById: (id: string, token: string) =>
    apiRequest(`/api/addresses/${id}`, "GET", null, token),

  createAddress: (addressData: any, token: string) =>
    apiRequest("/api/addresses", "POST", addressData, token),

  updateAddress: (id: string, addressData: any, token: string) =>
    apiRequest(`/api/addresses/${id}`, "PUT", addressData, token),

  deleteAddress: (id: string, token: string) =>
    apiRequest(`/api/addresses/${id}`, "DELETE", null, token),

  setDefaultAddress: (id: string, token: string) =>
    apiRequest(`/api/addresses/${id}/default`, "PUT", {}, token),
};

// Review services
export const reviewService = {
  getReviews: (params: { product?: string; user?: string } = {}) => {
    const queryParams = new URLSearchParams();

    if (params.product) queryParams.append("product", params.product);
    if (params.user) queryParams.append("user", params.user);

    return apiRequest(`/api/reviews?${queryParams.toString()}`);
  },

  getReviewById: (id: string) => apiRequest(`/api/reviews/${id}`),

  createReview: (reviewData: any, token: string) =>
    apiRequest("/api/reviews", "POST", reviewData, token),

  updateReview: (id: string, reviewData: any, token: string) =>
    apiRequest(`/api/reviews/${id}`, "PUT", reviewData, token),

  deleteReview: (id: string, token: string) =>
    apiRequest(`/api/reviews/${id}`, "DELETE", null, token),
};

// Payment services
export const paymentService = {
  getPayments: (token: string) =>
    apiRequest("/api/payments", "GET", null, token),

  getPaymentById: (id: string, token: string) =>
    apiRequest(`/api/payments/${id}`, "GET", null, token),

  createPayment: (paymentData: any, token: string) =>
    apiRequest("/api/payments", "POST", paymentData, token),
};
