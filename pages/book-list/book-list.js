const { bookApi } = require("../../utils/api.js");

Page({
  data: {
    categoryId: null,
    categoryName: "全部图书",
    bookList: [],
    loading: false
  },

  onLoad(options) {
    const categoryId = options.categoryId ? Number(options.categoryId) : null;
    const categoryName = options.categoryName || "全部图书";

    this.setData({ categoryId, categoryName });
    wx.setNavigationBarTitle({ title: categoryName });
    this.loadBookList();
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.loadBookList().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  async loadBookList() {
    const { categoryId } = this.data;
    this.setData({ loading: true });

    try {
      const params = categoryId ? { categoryId, page: 1, limit: 50 } : { page: 1, limit: 50 };
      // 核心修复：适配后端PageResult，取records数组
      const pageData = await bookApi.getBooks(params);
      this.setData({
        bookList: pageData.records || []
      });
    } catch (err) {
      console.error("图书列表加载失败：", err);
      wx.showToast({ title: "加载失败", icon: "none" });
    } finally {
      this.setData({ loading: false });
    }
  },

  goDetail(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/book-detail/book-detail?id=${id}`,
    });
  },
});