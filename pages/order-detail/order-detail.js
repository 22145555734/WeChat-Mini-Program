const {
  getOrders,
  cancelOrder,
  payOrder,
  shipOrder,
  completeOrder,
} = require("../../utils/storage");
const {
  formatTime,
  statusText,
  formatPrice,
} = require("../../utils/format.js");

Page({
  data: {
    order: null,
  },

  onLoad(options) {
    const orderId = options.id;
    this.loadOrderDetail(orderId);
  },

  loadOrderDetail(orderId) {
    const orders = getOrders();
    const order = orders.find((o) => o.id === orderId);

    if (!order) {
      wx.showToast({
        title: "订单不存在",
        icon: "none",
      });
      setTimeout(() => wx.navigateBack(), 1000);
      return;
    }

    this.setData({
      order: {
        ...order,
        createTimeText: formatTime(order.createTime),
        statusText: statusText(order.status),
        totalPriceText: Number(order.totalPrice || 0).toFixed(2),
      },
    });
  },

  // 取消订单
  onCancelOrder() {
    const { order } = this.data;
    wx.showModal({
      title: "提示",
      content: "确定要取消该订单吗？",
      success: (res) => {
        if (res.confirm) {
          cancelOrder(order.id);
          wx.showToast({ title: "已取消", icon: "success" });
          this.loadOrderDetail(order.id);
        }
      },
    });
  },

  // 支付订单
  onPayOrder() {
    const { order } = this.data;
    wx.showLoading({ title: "支付中..." });
    setTimeout(() => {
      payOrder(order.id);
      wx.hideLoading();
      wx.showToast({ title: "支付成功", icon: "success" });
      this.loadOrderDetail(order.id);
    }, 1500);
  },

  // 发货（模拟）
  onShipOrder() {
    const { order } = this.data;
    wx.showLoading({ title: "发货中..." });
    setTimeout(() => {
      shipOrder(order.id);
      wx.hideLoading();
      wx.showToast({ title: "已发货", icon: "success" });
      this.loadOrderDetail(order.id);
    }, 1000);
  },

  // 确认收货
  onCompleteOrder() {
    const { order } = this.data;
    wx.showModal({
      title: "提示",
      content: "确认已收到商品吗？",
      success: (res) => {
        if (res.confirm) {
          completeOrder(order.id);
          wx.showToast({ title: "交易完成", icon: "success" });
          this.loadOrderDetail(order.id);
        }
      },
    });
  },

  // 跳转图书详情
  goBookDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/book-detail/book-detail?id=${id}`,
    });
  },
});
