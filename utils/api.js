// API接口管理
const { get, post, put, del } = require("./request.js");

// ==================== 用户相关API ====================
const userApi = {
  login: (data) => post("/auth/login", data),
  register: (data) => post("/auth/register", data),
  getUserInfo: () => get("/auth/profile"),
  logout: () => post("/auth/logout"),
};

// ==================== Banner轮播图API ====================
const bannerApi = {
  getBanners: () => get("/banners"),
};

// ==================== 图书分类API ====================
const categoryApi = {
  getCategories: () => get("/categories"),
  getCategoryById: (id) => get(`/categories/${id}`),
};

// ==================== 图书相关API ====================
const bookApi = {
  // 获取图书列表（分类筛选/全部）
  getBooks: (params = { page: 1, limit: 50 }) => get("/books", params),
  // 图书详情
  getBookById: (id) => get(`/books/${id}`),
  // 热门图书
  getHotBooks: (params = { page: 1, limit: 10 }) => get("/books/hot", params),
  // 新书上架
  getNewBooks: (params = { page: 1, limit: 10 }) => get("/books/new", params),
  // 搜索图书
  searchBooks: (params) => get("/books/search", params),
};

// ==================== 地址相关API ====================
const addressApi = {
  getAddresses: () => get("/addresses"),
  getAddressById: (id) => get(`/addresses/${id}`),
  addAddress: (data) => post("/addresses", data),
  updateAddress: (id, data) => put(`/addresses/${id}`, data),
  deleteAddress: (id) => del(`/addresses/${id}`),
};

// ==================== 购物车相关API ====================
const cartApi = {
  getCart: () => get("/cart"),
  addToCart: (data) => post("/cart", data),
  updateCart: (id, data) => put(`/cart/${id}`, data),
  deleteCartItem: (id) => del(`/cart/${id}`),
  clearCart: () => del("/cart"),
};

// ==================== 订单相关API ====================
const orderApi = {
  getOrders: () => get("/orders"),
  getOrderById: (id) => get(`/orders/${id}`),
  createOrder: (data) => post("/orders", data),
  cancelOrder: (id) => put(`/orders/${id}/cancel`),
};

module.exports = {
  userApi,
  bannerApi,
  categoryApi,
  bookApi,
  addressApi,
  cartApi,
  orderApi,
};