const { bannerApi, categoryApi, bookApi } = require("../../utils/api.js");

Page({
  data: {
    banners: [],
    categories: [],
    hotBooks: [],
    newBooks: [],
  },

  onLoad() {
    this.initPageData();
  },

  async initPageData() {
    wx.showLoading({ title: "加载中..." });

    try {
      // 并行请求所有接口（注意：这里拿到的是PageResult对象）
      const [banners, categories, hotBooksResult, newBooksResult] = await Promise.all([
        bannerApi.getBanners(),
        categoryApi.getCategories(),
        bookApi.getHotBooks(),
        bookApi.getNewBooks(),
      ]);

      // 🔥 核心修复：只取PageResult的records数组
      this.setData({
        banners: banners,
        categories: categories,
        hotBooks: hotBooksResult.records || [],
        newBooks: newBooksResult.records || [],
      });

      console.log("首页数据加载成功", this.data);
    } catch (error) {
      console.error("首页数据加载失败:", error);
      wx.showToast({ title: "数据加载失败", icon: "none" });
    } finally {
      wx.hideLoading();
    }
  },

  goCategory(e) {
    const { id, name } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/book-list/book-list?categoryId=${id}&categoryName=${name}`,
    });
  },

  goDetail(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/book-detail/book-detail?id=${id}`,
    });
  },

  onSearchTap() {
    wx.navigateTo({
      url: "/pages/search/search",
    });
  },
});