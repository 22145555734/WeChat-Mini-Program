// pages/profile/profile.js
const { userApi } = require("../../utils/api.js");

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
    this.checkLoginStatus();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.checkLoginStatus();
  },

  /**
   * 检查登录状态
   */
  checkLoginStatus() {
    const token = wx.getStorageSync("token");
    const userInfo = wx.getStorageSync("userInfo");

    if (token && userInfo) {
      this.setData({
        isLoggedIn: true,
        userInfo,
      });
    } else {
      this.setData({
        isLoggedIn: false,
        userInfo: null,
      });
    }
  },

  /**
   * 点击卡片：未登录时跳转到登录页
   */
  onCardTap() {
    if (!this.data.isLoggedIn) {
      this.onLogin();
    }
  },

  /**
   * 跳转到登录页面
   */
  onLogin() {
    wx.navigateTo({
      url: "/pages/login/login",
    });
  },

  /**
   * 退出登录
   */
  async onLogout() {
    wx.showModal({
      title: "提示",
      content: "确定要退出登录吗？",
      success: async (res) => {
        if (res.confirm) {
          try {
            // 调用后端退出接口
            await userApi.logout();
          } catch (error) {
            console.error("退出登录失败:", error);
          }

          // 清除本地存储
          wx.removeStorageSync("token");
          wx.removeStorageSync("userInfo");

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
   * 加载订单统计数据（待实现：从后端获取）
   */
  loadOrderStats() {
    // TODO: 从后端获取订单统计数据
    this.setData({
      pendingCount: 0,
      paidCount: 0,
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
