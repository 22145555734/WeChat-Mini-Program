// 网络请求工具类
const BASE_URL = "http://localhost:3000/api";

// 请求拦截器
const requestInterceptor = (config) => {
  // 从本地存储获取 Token 并自动添加到请求头
  const token = wx.getStorageSync("token");

  if (token) {
    config.header = {
      ...config.header,
      Authorization: "Bearer " + token,
    };
  }

  return config;
};

// 响应拦截器
const responseInterceptor = (response) => {
  const { statusCode, data } = response;

  // Token 过期或无效处理
  if (statusCode === 401) {
    wx.showToast({
      title: "登录已过期，请重新登录",
      icon: "none",
    });

    // 清除过期 Token 和用户信息
    wx.removeStorageSync("token");
    wx.removeStorageSync("userInfo");

    // 跳转到登录页
    setTimeout(() => {
      wx.redirectTo({ url: "/pages/login/login" });
    }, 1500);

    return Promise.reject(response);
  }

  if (statusCode === 200) {
    return data;
  } else {
    // 统一错误处理
    wx.showToast({
      title: `请求错误: ${statusCode}`,
      icon: "none",
    });
    return Promise.reject(response);
  }
};

// 错误处理
const errorHandler = (error) => {
  console.error("请求失败:", error);
  wx.showToast({
    title: "网络请求失败",
    icon: "none",
  });
  return Promise.reject(error);
};

// 基础请求方法
const request = (options) => {
  const { url, method = "GET", data = {}, header = {} } = options;

  const config = requestInterceptor({
    url: BASE_URL + url,
    method,
    data,
    header: {
      "Content-Type": "application/json",
      ...header,
    },
  });

  return new Promise((resolve, reject) => {
    wx.request({
      ...config,
      success: (res) => {
        try {
          const result = responseInterceptor(res);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      },
      fail: (err) => {
        errorHandler(err);
        reject(err);
      },
    });
  });
};

// GET请求
const get = (url, data = {}, options = {}) => {
  return request({
    url,
    method: "GET",
    data,
    ...options,
  });
};

// POST请求
const post = (url, data = {}, options = {}) => {
  return request({
    url,
    method: "POST",
    data,
    ...options,
  });
};

// PUT请求
const put = (url, data = {}, options = {}) => {
  return request({
    url,
    method: "PUT",
    data,
    ...options,
  });
};

// DELETE请求
const del = (url, data = {}, options = {}) => {
  return request({
    url,
    method: "DELETE",
    data,
    ...options,
  });
};

module.exports = {
  request,
  get,
  post,
  put,
  del,
  BASE_URL,
};
