// miniprogram/utils/storage.js
const books = require("../data/books.js");

const KEYS = {
  CART: "BOOK_CART",
  ORDERS: "BOOK_ORDERS",
  CHECKOUT_ITEMS: "CHECKOUT_ITEMS",
  ADDRESSES: "BOOK_ADDRESSES",
  SELECTED_ADDRESS: "SELECTED_ADDRESS",
  STOCK: "BOOK_STOCK",
};

// ========== 库存管理 ==========

function initStock() {
  const existing = wx.getStorageSync(KEYS.STOCK);
  if (existing) return;

  // 从books数据初始化库存
  const stockMap = {};
  books.forEach((book) => {
    stockMap[book.id] = book.stock || 10;
  });
  wx.setStorageSync(KEYS.STOCK, stockMap);
}

function getStockMap() {
  initStock();
  return wx.getStorageSync(KEYS.STOCK) || {};
}

function setStockMap(map) {
  wx.setStorageSync(KEYS.STOCK, map || {});
}

function getStock(bookId) {
  const map = getStockMap();
  return map[bookId] ?? 0;
}

// 检查库存
function checkStock(items) {
  const stockMap = getStockMap();
  for (const item of items) {
    const currentStock = stockMap[item.id] ?? 0;
    if (currentStock < Number(item.count || 1)) {
      return {
        success: false,
        message: `${item.name || "商品"} 库存不足`,
      };
    }
  }
  return { success: true };
}

// 扣减库存
function deductStock(items) {
  const stockMap = getStockMap();
  items.forEach((item) => {
    const currentStock = stockMap[item.id] ?? 0;
    stockMap[item.id] = Math.max(0, currentStock - Number(item.count));
  });
  setStockMap(stockMap);
}

// 回滚库存
function restoreStock(items) {
  const stockMap = getStockMap();
  items.forEach((item) => {
    const currentStock = stockMap[item.id] ?? 0;
    stockMap[item.id] = currentStock + Number(item.count);
  });
  setStockMap(stockMap);
}

// ========== 购物车 ==========

function getCart() {
  return wx.getStorageSync(KEYS.CART) || [];
}

function setCart(cart) {
  wx.setStorageSync(KEYS.CART, cart || []);
}

// ========== 订单 ==========

function getOrders() {
  return wx.getStorageSync(KEYS.ORDERS) || [];
}

function setOrders(orders) {
  wx.setStorageSync(KEYS.ORDERS, orders || []);
}

function createOrder({ items = [], address = null, remark = "" }) {
  // 下单时检查库存
  const stockCheck = checkStock(items);
  if (!stockCheck.success) {
    throw new Error(stockCheck.message);
  }

  const totalCount = items.reduce((sum, i) => sum + Number(i.count || 0), 0);
  const totalPrice = Number(
    items
      .reduce((sum, i) => sum + Number(i.price || 0) * Number(i.count || 0), 0)
      .toFixed(2),
  );

  const order = {
    id: "OD" + Date.now(), // 简单订单号
    createTime: Date.now(),
    status: "PENDING", // PENDING / PAID / CANCELED
    items: items.map((i) => ({
      id: i.id,
      name: i.name || i.title || "",
      cover: i.cover,
      price: Number(i.price || 0),
      count: Number(i.count || 0),
    })),
    totalCount,
    totalPrice,
    address,
    remark,
  };

  const orders = getOrders();
  orders.unshift(order); // 最新在前
  setOrders(orders);

  return order;
}

function updateOrderStatus(orderId, status) {
  const orders = getOrders();
  const index = orders.findIndex((o) => o.id === orderId);
  if (index > -1) {
    orders[index].status = status;
    setOrders(orders);
  }
}

// 发货
function shipOrder(orderId) {
  updateOrderStatus(orderId, "SHIPPED");
}

// 确认收货/完成
function completeOrder(orderId) {
  updateOrderStatus(orderId, "COMPLETED");
}

function cancelOrder(orderId) {
  const orders = getOrders();
  const order = orders.find((o) => o.id === orderId);
  if (!order) return;

  // 已支付订单取消时回滚库存
  if (order.status === "PAID") {
    restoreStock(order.items);
  }

  updateOrderStatus(orderId, "CANCELED");
}

function payOrder(orderId) {
  const orders = getOrders();
  const order = orders.find((o) => o.id === orderId);
  if (!order || order.status !== "PENDING") return;

  // 支付时扣减库存
  deductStock(order.items);

  updateOrderStatus(orderId, "PAID");
}

// ========== 地址 ==========

function getAddresses() {
  return wx.getStorageSync(KEYS.ADDRESSES) || [];
}

function setAddresses(addresses) {
  wx.setStorageSync(KEYS.ADDRESSES, addresses || []);
}

function addAddress(address) {
  const addresses = getAddresses();
  const id = Date.now();
  addresses.push({
    ...address,
    id,
    isDefault: addresses.length === 0, // 第一个设为默认
  });
  setAddresses(addresses);
  return id;
}

function updateAddress(id, address) {
  const addresses = getAddresses();
  const index = addresses.findIndex((a) => a.id === id);
  if (index > -1) {
    addresses[index] = { ...addresses[index], ...address };
    setAddresses(addresses);
  }
}

function deleteAddress(id) {
  const addresses = getAddresses().filter((a) => a.id !== id);
  setAddresses(addresses);
}

function setDefaultAddress(id) {
  const addresses = getAddresses().map((a) => ({
    ...a,
    isDefault: a.id === id,
  }));
  setAddresses(addresses);
}

function getDefaultAddress() {
  const addresses = getAddresses();
  return addresses.find((a) => a.isDefault) || addresses[0] || null;
}

function getSelectedAddress() {
  return wx.getStorageSync(KEYS.SELECTED_ADDRESS) || getDefaultAddress();
}

function setSelectedAddress(address) {
  wx.setStorageSync(KEYS.SELECTED_ADDRESS, address);
}

module.exports = {
  KEYS,
  // 库存
  initStock,
  getStockMap,
  getStock,
  checkStock,
  deductStock,
  restoreStock,
  // 购物车
  getCart,
  setCart,
  // 订单
  getOrders,
  setOrders,
  createOrder,
  updateOrderStatus,
  cancelOrder,
  payOrder,
  shipOrder,
  completeOrder,
  // 地址
  getAddresses,
  setAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  getDefaultAddress,
  getSelectedAddress,
  setSelectedAddress,
};
