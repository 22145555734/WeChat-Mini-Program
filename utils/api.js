// API接口管理
const { get, post, put, del } = require("./request.js");

// ==================== 用户相关API ====================
const userApi = {
  // 登录
  login: (data) => post("/users/login", data),
  // 注册
  register: (data) => post("/users/register", data),
  // 获取用户信息
  getUserInfo: () => get("/users/info"),
  // 退出登录
  logout: () => post("/users/logout"),
};

// ==================== Banner相关API ====================
const bannerApi = {
  // 获取banner列表
  getBanners: () => get("/banners"),
};

// ==================== 分类相关API ====================
const categoryApi = {
  // 获取分类列表
  getCategories: () => get("/categories"),
  // 获取分类详情
  getCategoryById: (id) => get(`/categories/${id}`),
};

// ==================== 图书相关API ====================
const bookApi = {
  // 获取图书列表
  getBooks: (params) => get("/books", params),
  // 获取图书详情
  getBookById: (id) => get(`/books/${id}`),
  // 获取热门图书
  getHotBooks: () => get("/books/hot"),
  // 获取新书
  getNewBooks: () => get("/books/new"),
  // 根据分类获取图书
  getBooksByCategory: (categoryId) => get(`/categories/${categoryId}/books`),
  // 搜索图书
  searchBooks: (keyword) => get("/books/search", { keyword }),
};

// ==================== 地址相关API ====================
const addressApi = {
  // 获取地址列表
  getAddresses: () => get("/addresses"),
  // 获取地址详情
  getAddressById: (id) => get(`/addresses/${id}`),
  // 新增地址
  addAddress: (data) => post("/addresses", data),
  // 更新地址
  updateAddress: (id, data) => put(`/addresses/${id}`, data),
  // 删除地址
  deleteAddress: (id) => del(`/addresses/${id}`),
};

// ==================== 购物车相关API ====================
const cartApi = {
  // 获取购物车列表
  getCart: () => get("/cart"),
  // 添加到购物车
  addToCart: (data) => post("/cart", data),
  // 更新购物车
  updateCart: (id, data) => put(`/cart/${id}`, data),
  // 删除购物车项
  deleteCartItem: (id) => del(`/cart/${id}`),
  // 清空购物车
  clearCart: () => del("/cart"),
};

// ==================== 订单相关API ====================
const orderApi = {
  // 获取订单列表
  getOrders: () => get("/orders"),
  // 获取订单详情
  getOrderById: (id) => get(`/orders/${id}`),
  // 创建订单
  createOrder: (data) => post("/orders", data),
  // 取消订单
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
