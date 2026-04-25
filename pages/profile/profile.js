// pages/profile/profile.js
const storage = require("../../utils/storage.js");

Page({
  /**
   * 页面的初始数据
   */
  data: {
    pendingCount: 0,
    paidCount: 0,
    isLoggedIn: false,
    userInfo: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    // 检查登录状态
    const userInfo = wx.getStorageSync("USER_INFO");
    if (userInfo) {
      this.setData({
        isLoggedIn: true,
        userInfo,
      });
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.loadOrderStats();
  },

  /**
   * 模拟登录
   */
  onLogin() {
    wx.showLoading({ title: "登录中..." });
    setTimeout(() => {
      const userInfo = {
        nickName: "图书爱好者",
        avatar: "",
        phone: "138****8888",
        email: "booklover@example.com",
        username: "booklover",
        password: "********",
      };
      wx.setStorageSync("USER_INFO", userInfo);
      this.setData({
        isLoggedIn: true,
        userInfo,
      });
      wx.hideLoading();
      wx.showToast({ title: "登录成功", icon: "success" });
    }, 1000);
  },

  /**
   * 退出登录
   */
  onLogout() {
    wx.showModal({
      title: "提示",
      content: "确定要退出登录吗？",
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync("USER_INFO");
          this.setData({
            isLoggedIn: false,
            userInfo: null,
          });
          wx.showToast({ title: "已退出登录", icon: "success" });
        }
      },
    });
  },

  /**
   * 加载订单统计数据
   */
  loadOrderStats() {
    const orders = storage.getOrders();
    const pendingCount = orders.filter((o) => o.status === "PENDING").length;
    const paidCount = orders.filter((o) => o.status === "PAID").length;

    this.setData({
      pendingCount,
      paidCount,
    });
  },

  /**
   * 跳转到订单列表
   */
  goToOrders(e) {
    const status = e.currentTarget.dataset.status;
    const url = status
      ? `/pages/order-list/order-list?status=${status}`
      : "/pages/order-list/order-list";
    wx.navigateTo({
      url,
    });
  },

  /**
   * 跳转到地址管理
   */
  goToAddress() {
    wx.navigateTo({
      url: "/pages/address/address",
    });
  },

  /**
   * 清空缓存
   */
  clearStorage() {
    wx.showModal({
      title: "提示",
      content: "确定要清空所有缓存数据吗？这将清除购物车、订单和地址信息。",
      success: (res) => {
        if (res.confirm) {
          wx.clearStorageSync();
          this.loadOrderStats();
          wx.showToast({
            title: "缓存已清空",
            icon: "success",
          });
        }
      },
    });
  },
});
