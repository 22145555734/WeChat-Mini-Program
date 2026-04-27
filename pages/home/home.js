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
      // 并行请求所有数据
      const [bannersRes, categoriesRes, hotBooksRes, newBooksRes] =
        await Promise.all([
          bannerApi.getBanners(),
          categoryApi.getCategories(),
          bookApi.getHotBooks(),
          bookApi.getNewBooks(),
        ]);

      this.setData({
        banners: bannersRes.data,
        categories: categoriesRes.data,
        hotBooks: hotBooksRes.data,
        newBooks: newBooksRes.data,
      });
    } catch (error) {
      console.error("加载数据失败:", error);
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
