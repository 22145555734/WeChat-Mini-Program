const BASE_URL = "http://localhost:8080/api";

// 修复后的请求拦截器：永远不会出现 undefined
const requestInterceptor = (config) => {
  // 强制初始化 header
  config.header = config.header || {};

  // 自动添加 token（如果存在）
  const token = wx.getStorageSync("token");
  if (token) {
    config.header.Authorization = `Bearer ${token}`;
  }

  // 设置 Content-Type
  config.header["Content-Type"] = "application/json";
  return config;
};

// 响应拦截器：正确解析后端返回
const responseInterceptor = (response) => {
  const { statusCode, data } = response;

  if (statusCode === 401) {
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    if (currentPage.route !== "pages/login/login") {
      wx.removeStorageSync("token");
      wx.removeStorageSync("userInfo");
      wx.redirectTo({ url: "/pages/login/login" });
    }
    return Promise.reject(response);
  }

  if (data.code !== 200) {
    wx.showToast({ title: data.msg || "请求失败", icon: "none" });
    return Promise.reject(data);
  }

  return data.data;
};

// 基础请求方法
const request = (options) => {
  return new Promise((resolve, reject) => {
    const config = requestInterceptor(options);

    wx.request({
      ...config,
      url: BASE_URL + config.url,
      success: (res) => {
        try {
          const result = responseInterceptor(res);
          resolve(result);
        } catch (err) {
          reject(err);
        }
      },
      fail: (err) => {
        wx.showToast({ title: "网络异常", icon: "none" });
        reject(err);
      }
    });
  });
};

const get = (url, data) => request({ url, method: "GET", data });
const post = (url, data) => request({ url, method: "POST", data });
const put = (url, data) => request({ url, method: "PUT", data });
const del = (url, data) => request({ url, method: "DELETE", data });

module.exports = { request, get, post, put, del, BASE_URL };