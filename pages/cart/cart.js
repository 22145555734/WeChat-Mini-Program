const cartUtil = require("../../utils/cart.js");

Page({
  data: {
    cart: [],
    totalPrice: 0,
    totalCount: 0,
    checkedCount: 0,
    allChecked: false,
  },

  onShow() {
    this.loadCart();
  },

  loadCart() {
    const cart = cartUtil.getCart();
    const summary = cartUtil.calc(cart);
    this.setData({
      cart,
      ...summary,
    });
  },

  onToggleItem(e) {
    const id = Number(e.currentTarget.dataset.id);
    cartUtil.toggleChecked(id);
    this.loadCart();
  },

  onToggleAll(e) {
    const checked = e.detail.value.length > 0;
    cartUtil.toggleAll(checked);
    this.loadCart();
  },

  onMinus(e) {
    const id = Number(e.currentTarget.dataset.id);
    const item = this.data.cart.find((i) => i.id === id);
    if (!item) return;
    cartUtil.updateCount(id, item.count - 1);
    this.loadCart();
  },

  onPlus(e) {
    const id = Number(e.currentTarget.dataset.id);
    const item = this.data.cart.find((i) => i.id === id);
    if (!item) return;
    if (item.count >= item.stock) {
      wx.showToast({ title: "已达库存上限", icon: "none" });
      return;
    }
    cartUtil.updateCount(id, item.count + 1);
    this.loadCart();
  },

  onRemove(e) {
    const id = Number(e.currentTarget.dataset.id);
    wx.showModal({
      title: "提示",
      content: "确定删除该商品吗？",
      success: (res) => {
        if (res.confirm) {
          cartUtil.removeItem(id);
          this.loadCart();
        }
      },
    });
  },

  onCheckout() {
    if (this.data.checkedCount === 0) {
      wx.showToast({ title: "请先选择商品", icon: "none" });
      return;
    }
    wx.showToast({
      title: `结算金额 ¥${this.data.totalPrice}`,
      icon: "none",
    });
  },

  onCheckoutTap() {
    const cartUtil = require("../../utils/cart.js");
    const cart = cartUtil.getCart();
    const checkedItems = cart.filter((item) => item.checked);

    if (!checkedItems.length) {
      wx.showToast({ title: "请先勾选商品", icon: "none" });
      return;
    }

    // 用 storage 传数据，避免 URL 过长
    wx.setStorageSync("CHECKOUT_ITEMS", checkedItems);
    wx.navigateTo({
      url: "/pages/checkout/checkout",
    });
  },
});
