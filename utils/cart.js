// 购物车工具 - 统一使用 storage.js 管理
const storage = require("./storage.js");

function getCart() {
  return storage.getCart();
}

function setCart(cart) {
  storage.setCart(cart);
}

function addToCart(book, count = 1) {
  const cart = getCart();
  const idx = cart.findIndex((item) => item.id === book.id);

  if (idx > -1) {
    cart[idx].count += count;
  } else {
    cart.push({
      id: book.id,
      name: book.name,
      author: book.author,
      price: book.price,
      cover: book.cover,
      stock: book.stock || 99,
      count,
      checked: true,
    });
  }

  setCart(cart);
  return cart;
}

function updateCount(id, count) {
  const cart = getCart();
  const idx = cart.findIndex((item) => item.id === id);
  if (idx > -1) {
    cart[idx].count = count < 1 ? 1 : count;
    if (cart[idx].count > cart[idx].stock) cart[idx].count = cart[idx].stock;
    setCart(cart);
  }
  return cart;
}

function toggleChecked(id) {
  const cart = getCart();
  const idx = cart.findIndex((item) => item.id === id);
  if (idx > -1) {
    cart[idx].checked = !cart[idx].checked;
    setCart(cart);
  }
  return cart;
}

function toggleAll(checked) {
  const cart = getCart().map((item) => ({ ...item, checked }));
  setCart(cart);
  return cart;
}

function removeItem(id) {
  const cart = getCart().filter((item) => item.id !== id);
  setCart(cart);
  return cart;
}

function clearCart() {
  setCart([]);
}

function calc(cart = getCart()) {
  let totalCount = 0;
  let totalPrice = 0;
  let checkedCount = 0;

  cart.forEach((item) => {
    totalCount += item.count;
    if (item.checked) {
      checkedCount += item.count;
      totalPrice += item.price * item.count;
    }
  });

  const allChecked = cart.length > 0 && cart.every((item) => item.checked);

  return {
    totalCount,
    checkedCount,
    totalPrice: Number(totalPrice.toFixed(2)),
    allChecked,
  };
}

module.exports = {
  getCart,
  setCart,
  addToCart,
  updateCount,
  toggleChecked,
  toggleAll,
  removeItem,
  clearCart,
  calc,
};
