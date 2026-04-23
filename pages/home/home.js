const banners = require("../../data/banners.js");
const categories = require("../../data/categories.js");
const books = require("../../data/books.js");

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

  initPageData() {
    const hotBooks = books.filter((item) => item.isHot);
    const newBooks = books.filter((item) => item.isNew);

    this.setData({
      banners,
      categories,
      hotBooks,
      newBooks,
    });
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
