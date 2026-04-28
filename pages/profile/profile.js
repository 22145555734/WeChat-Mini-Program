// pages/profile/profile.js
const { userApi } = require("../../utils/api.js");

Page({
  data: {
    userInfo: null,
  },

  onLoad() {
    console.log("profile onLoad");
    this.checkLoginStatus();
  },

  onShow() {
    console.log("profile onShow");
    this.checkLoginStatus();
  },

  checkLoginStatus() {
    const userInfo = wx.getStorageSync("userInfo");
    console.log("【调试日志】读取到的userInfo:", userInfo);

    if (userInfo && userInfo.id) {
      this.setData({ userInfo });
      console.log("【调试日志】已登录，设置用户信息成功");
    } else {
      this.setData({ userInfo: null });
      console.log("【调试日志】未登录，userInfo为空");
    }
  },

  goLogin() {
    wx.navigateTo({ url: "/pages/login/login" });
  },

  /**
   * 退出登录处理函数
   */
  onLogout() {
    wx.showModal({
      title: "提示",
      content: "确定退出登录吗？",
      success: (res) => {
        if (res.confirm) {
          // 1. 清除本地缓存
          wx.removeStorageSync("token");
          wx.removeStorageSync("userInfo");

          // 2. 重置页面数据，让界面变回未登录状态
          this.setData({ userInfo: null });

          // 3. 提示并跳转
          wx.showToast({
            title: "已退出",
            icon: "success",
            duration: 1500,
            success: () => {
              // 使用 redirectTo 替换当前页面，防止退出后点返回键又回到个人中心
              setTimeout(() => {
                wx.redirectTo({
                  url: '/pages/login/login',
                });
              }, 1500);
            }
          });
        }
      }
    });
  },

  goToAddress() {
    if (!this.data.userInfo) {
      wx.showToast({ title: "请先登录", icon: "none" });
      this.goLogin();
      return;
    }
    wx.navigateTo({ url: "/pages/address/address" });
  },

  clearStorage() {
    wx.showModal({
      title: "提示",
      content: "确定要清空所有缓存数据吗？",
      success: (res) => {
        if (res.confirm) {
          wx.clearStorageSync();
          this.checkLoginStatus();
          wx.showToast({ title: "缓存已清空", icon: "success" });
        }
      }
    });
  }
});