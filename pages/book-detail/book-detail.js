const books = require("../../data/books.js");
const cartUtil = require("../../utils/cart.js");

Page({
  data: {
    book: null,
    count: 1,
  },

  onLoad(options) {
    const id = options.id ? Number(options.id) : null;
    const book = books.find((item) => Number(item.id) === id);

    if (!book) {
      wx.showToast({
        title: "未找到该图书",
        icon: "none",
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 1200);
      return;
    }

    this.setData({ book });

    wx.setNavigationBarTitle({
      title: book.name || "图书详情",
    });
  },

  // 减少数量
  onMinus() {
    const count = this.data.count;
    if (count > 1) {
      this.setData({ count: count - 1 });
    }
  },

  // 增加数量
  onPlus() {
    const { book, count } = this.data;
    const stock = book?.stock || 99;
    if (count < stock) {
      this.setData({ count: count + 1 });
    } else {
      wx.showToast({ title: "已达库存上限", icon: "none" });
    }
  },

  // 手动输入数量
  onCountInput(e) {
    const value = parseInt(e.detail.value) || 1;
    const stock = this.data.book?.stock || 99;
    const count = Math.max(1, Math.min(value, stock));
    this.setData({ count });
  },

  onBuyTap() {
    const { book, count } = this.data;
    if (!book) return;

    // 立即购买：直接创建结算数据，不经过购物车
    const checkoutItems = [
      {
        ...book,
        count,
        checked: true,
      },
    ];

    wx.setStorageSync("CHECKOUT_ITEMS", checkoutItems);
    wx.navigateTo({
      url: "/pages/checkout/checkout",
    });
  },

  onAddCartTap() {
    const { book, count } = this.data;
    if (!book) return;

    cartUtil.addToCart(book, count);

    wx.showToast({
      title: "已加入购物车",
      icon: "success",
    });
  },
});
