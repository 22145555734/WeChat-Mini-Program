// miniprogram/pages/order-list/order-list.js
const { getOrders, cancelOrder, payOrder } = require("../../utils/storage");
const {
  formatTime,
  statusText,
  formatPrice,
} = require("../../utils/format.js");

Page({
  data: {
    orders: [],
    filterStatus: null,
  },

  onLoad(options) {
    if (options.status) {
      this.setData({
        filterStatus: options.status,
      });
    }
  },

  onShow() {
    let orders = getOrders();
    // 按状态筛选
    if (this.data.filterStatus) {
      orders = orders.filter((o) => o.status === this.data.filterStatus);
    }
    orders = orders.map((o) => ({
      ...o,
      createTimeText: formatTime(o.createTime),
      statusText: statusText(o.status),
      totalPriceText: Number(o.totalPrice || 0).toFixed(2),
    }));

    this.setData({ orders });
  },

  goShopping() {
    wx.switchTab({
      url: "/pages/home/home",
    });
  },

  onCancelOrder(e) {
    const orderId = e.currentTarget.dataset.id;
    wx.showModal({
      title: "提示",
      content: "确定要取消该订单吗？",
      success: (res) => {
        if (res.confirm) {
          cancelOrder(orderId);
          wx.showToast({ title: "已取消", icon: "success" });
          this.onShow();
        }
      },
    });
  },

  onPayOrder(e) {
    const orderId = e.currentTarget.dataset.id;
    wx.showLoading({ title: "支付中..." });
    // 模拟支付过程
    setTimeout(() => {
      payOrder(orderId);
      wx.hideLoading();
      wx.showToast({ title: "支付成功", icon: "success" });
      this.onShow();
    }, 1500);
  },

  // 跳转订单详情
  goOrderDetail(e) {
    const orderId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/order-detail/order-detail?id=${orderId}`,
    });
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.onShow();
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 500);
  },
});
