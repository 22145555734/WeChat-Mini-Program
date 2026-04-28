const { userApi } = require("../../utils/api.js");

Page({
  data: {
    username: "",
    password: "",
    loading: false,
  },

  onLoad() {
    const token = wx.getStorageSync("token");
    if (token) {
      wx.switchTab({ url: "/pages/home/home" });
    }
  },

  onUsernameInput(e) {
    this.setData({ username: e.detail.value });
  },

  onPasswordInput(e) {
    this.setData({ password: e.detail.value });
  },

  async onLogin() {
    const { username, password } = this.data;

    if (!username || !password) {
      wx.showToast({ title: "请输入用户名和密码", icon: "none" });
      return;
    }

    this.setData({ loading: true });

    try {
      const loginRes = await userApi.login({ username, password });
      console.log("【登录调试】登录接口返回:", loginRes);

      wx.setStorageSync("token", loginRes.token);

      const userInfo = await userApi.getUserInfo();
      console.log("【登录调试】用户信息接口返回:", userInfo);

      wx.setStorageSync("userInfo", userInfo);
      console.log("【登录调试】用户信息已存入缓存:", wx.getStorageSync("userInfo"));

      wx.showToast({ title: "登录成功", icon: "success" });

      setTimeout(() => {
        wx.switchTab({ url: "/pages/home/home" });
      }, 1000);

    } catch (error) {
      console.error("登录失败:", error);
      wx.showToast({ title: "用户名或密码错误", icon: "none" });
    } finally {
      this.setData({ loading: false });
    }
  },

  async onRegister() {
    const { username, password } = this.data;

    if (!username || !password) {
      wx.showToast({ title: "请输入用户名和密码", icon: "none" });
      return;
    }

    this.setData({ loading: true });

    try {
      const res = await userApi.register({ username, password });

      wx.setStorageSync("token", res.token);
      wx.setStorageSync("userInfo", res.user);

      wx.showToast({ title: "注册成功", icon: "success" });

      setTimeout(() => {
        wx.switchTab({ url: "/pages/home/home" });
      }, 1000);

    } catch (error) {
      console.error("注册失败:", error);
      wx.showToast({ title: "注册失败，用户名可能已存在", icon: "none" });
    } finally {
      this.setData({ loading: false });
    }
  },
});