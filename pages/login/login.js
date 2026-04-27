const { userApi } = require("../../utils/api.js");

Page({
  data: {
    username: "admin",
    password: "123456",
    loading: false,
  },

  onLoad(options) {
    // 检查是否已登录
    const token = wx.getStorageSync("token");
    if (token) {
      wx.switchTab({ url: "/pages/home/home" });
    }
  },

  // 用户名输入
  onUsernameInput(e) {
    this.setData({ username: e.detail.value });
  },

  // 密码输入
  onPasswordInput(e) {
    this.setData({ password: e.detail.value });
  },

  // 登录
  async onLogin() {
    const { username, password } = this.data;

    if (!username || !password) {
      wx.showToast({
        title: "请输入用户名和密码",
        icon: "none",
      });
      return;
    }

    this.setData({ loading: true });

    try {
      const res = await userApi.login({ username, password });

      if (res.code === 200) {
        // 保存 Token 和用户信息
        wx.setStorageSync("token", res.data.token);
        wx.setStorageSync("userInfo", res.data.user);

        wx.showToast({
          title: "登录成功",
          icon: "success",
        });

        setTimeout(() => {
          wx.switchTab({ url: "/pages/home/home" });
        }, 1000);
      }
    } catch (error) {
      console.error("登录失败:", error);
      wx.showToast({
        title: "用户名或密码错误",
        icon: "none",
      });
    } finally {
      this.setData({ loading: false });
    }
  },

  // 注册
  async onRegister() {
    const { username, password } = this.data;

    if (!username || !password) {
      wx.showToast({
        title: "请输入用户名和密码",
        icon: "none",
      });
      return;
    }

    this.setData({ loading: true });

    try {
      const res = await userApi.register({ username, password });

      if (res.code === 200) {
        // 注册成功直接登录
        wx.setStorageSync("token", res.data.token);
        wx.setStorageSync("userInfo", res.data.user);

        wx.showToast({
          title: "注册成功",
          icon: "success",
        });

        setTimeout(() => {
          wx.switchTab({ url: "/pages/home/home" });
        }, 1000);
      }
    } catch (error) {
      console.error("注册失败:", error);
      wx.showToast({
        title: "注册失败，用户名可能已存在",
        icon: "none",
      });
    } finally {
      this.setData({ loading: false });
    }
  },
});
