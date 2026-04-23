// miniprogram/pages/checkout/checkout.js
const {
  getCart,
  setCart,
  createOrder,
  getSelectedAddress,
  setSelectedAddress,
} = require("../../utils/storage.js");

Page({
  data: {
    items: [],
    totalCount: 0,
    totalPrice: 0,
    address: null,
    remark: "",
    submitting: false,
  },

  onLoad() {
    const items = wx.getStorageSync("CHECKOUT_ITEMS") || [];
    if (!items.length) {
      wx.showToast({ title: "无可结算商品", icon: "none" });
      setTimeout(() => wx.navigateBack(), 800);
      return;
    }

    const normalizedItems = items.map((i) => ({
      ...i,
      amount: Number((Number(i.price) * Number(i.count)).toFixed(2)),
    }));

    const totalCount = normalizedItems.reduce((sum, i) => sum + i.count, 0);
    const totalPrice = Number(
      normalizedItems.reduce((sum, i) => sum + i.amount, 0).toFixed(2),
    );

    this.setData({
      items: normalizedItems,
      totalCount,
      totalPrice,
    });

    this.loadAddress();
  },

  onShow() {
    this.loadAddress();
  },

  loadAddress() {
    const address = getSelectedAddress();
    this.setData({ address });
  },

  goAddress() {
    wx.navigateTo({
      url: "/pages/address/address?mode=select",
    });
  },

  onRemarkInput(e) {
    this.setData({ remark: e.detail.value });
  },

  submitOrder() {
    if (this.data.submitting) return;

    const { items, address, remark } = this.data;
    if (!items.length) {
      wx.showToast({ title: "订单商品为空", icon: "none" });
      return;
    }

    if (!address) {
      wx.showToast({ title: "请选择收货地址", icon: "none" });
      return;
    }

    this.setData({ submitting: true });

    try {
      // 1) 创建订单（包含库存检查）
      const order = createOrder({
        items,
        address,
        remark,
      });

      // 2) 从购物车移除已结算商品
      const cart = getCart();
      const checkedIds = new Set(items.map((i) => i.id));
      const nextCart = cart.filter((i) => !checkedIds.has(i.id));
      setCart(nextCart);

      // 3) 清理临时结算数据
      wx.removeStorageSync("CHECKOUT_ITEMS");

      wx.showToast({ title: "下单成功", icon: "success" });

      setTimeout(() => {
        wx.redirectTo({
          url: "/pages/order-list/order-list",
        });
      }, 500);

      console.log("created order:", order);
    } catch (error) {
      wx.hideToast();
      wx.showModal({
        title: "下单失败",
        content: error.message || "库存不足，请调整商品数量",
        showCancel: false,
      });
      this.setData({ submitting: false });
    }
  },
});
